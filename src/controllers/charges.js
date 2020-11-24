const ClientsDB = require('../repositories/clients');
const response = require('./response');
const Pagarme = require('../integrations/pagarme');
const { sendEmail } = require('../integrations/nodemailer');

const createCharge = async (ctx) => {
	const { id, descricao, valor, vencimento } = ctx.request.body;
	if (!id || !descricao || !valor || !vencimento) {
		return response(ctx, 400, { message: 'Requisição mal formatada' });
	}

	const client = await ClientsDB.getClientById(id);
	if (!client) {
		return response(ctx, 404, { message: 'Cliente não encontrado' });
	}

	const charge = await Pagarme.payment({
		name: client.nome,
		cpf: client.cpf,
		amount: valor,
		boleto_expiration_date: vencimento,
	});

	// eslint-disable-next-line no-prototype-builtins
	if (charge.hasOwnProperty('errors')) {
		return response(ctx, 503, { message: 'Operação não realizada' });
	}
	await sendEmail({
		to: client.email,
		subject: `Seu boleto: ${descricao}`,
		html: `<!doctype html>
		<html>
		  <head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<title>Seu boleto</title>
			</head>
			<body>
			<h1 style="font-family: sans-serif"> Obrigado pela compra!</h1>
			<td> <a href=${charge.boleto_url} target="_blank">Clique aqui para baixar o boleto</a> </td>
			<p style="font-family: sans-serif"> ou copie o código de barras ${charge.boleto_barcode}</p>
			</body>`,
	});

	return response(ctx, 201, {
		cobranca: {
			idDoCliente: id,
			descricao,
			valor,
			vencimento: vencimento.split('-').reverse().join('/'),
			linkDoBoleto: charge.boleto_url,
			status: 'AGUARDANDO',
		},
	});
};

module.exports = { createCharge };

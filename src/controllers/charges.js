/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const ClientsDB = require('../repositories/clients');
const ChargesDB = require('../repositories/charges');
const response = require('./response');
const Pagarme = require('../integrations/pagarme');
const { sendEmail } = require('../integrations/nodemailer');

/** Função para criar cobrança, enviar email com link do boleto bancário e salvar cobrança no banco de dados */

const createCharge = async (ctx) => {
	const { id, descricao, valor, vencimento } = ctx.request.body;

	const idUser = ctx.state.id;

	if (!id || !descricao || !valor || !vencimento) {
		return response(ctx, 400, { message: 'Requisição mal formatada' });
	}


	const client = await ClientsDB.getClientById(id, idUser);
	if (!client) {
		return response(ctx, 404, { message: 'Cliente não encontrado' });
	}

	if (+vencimento < +new Date()) {
		return response(ctx, 400, { message: 'Insira uma data válida' });
	}

	const charge = await Pagarme.payment({
		name: client.nome,
		cpf: client.cpf,
		amount: valor,
		boleto_expiration_date: vencimento,
	});
	// eslint-disable-next-line no-prototype-builtins
	if (
		charge.hasOwnProperty('response') &&
		charge.response.hasOwnProperty('errors')
	) {
		return response(ctx, 400, charge);
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
			</body>
			</html>`,
	});

	const idDaCobranca = await ChargesDB.insertCharge({
		id_cliente: client.id,
		descricao,
		valor,
		vencimento,
		link_do_boleto: charge.boleto_url,
		codigo_de_barras: charge.boleto_barcode,
	});

	return response(ctx, 201, {
		cobranca: {
			idDoCliente: id,
			descricao,
			valor,
			vencimento: vencimento.split('-').reverse().join('/'),
			linkDoBoleto: charge.boleto_url,
			status: 'AGUARDANDO',
			idDaCobranca,
		},
	});
};

/** Função de listar cobranças e verificar status de pagamento */

const getCharges = async (ctx) => {
	const { cobrancasPorPagina = 10, offset = 0 } = ctx.query;
	const idUser = ctx.state.id;


	const list = await ChargesDB.findCharges(
		idUser,
		cobrancasPorPagina,
		offset
	);
	const result = list.map((charge) => {
		if (charge.esta_pago) {
			return {
				idDoCliente: charge.id_cliente,
				descricao: charge.descricao,
				valor: charge.valor,
				vencimento: charge.vencimento,
				linkDoBoleto: charge.link_do_boleto,
				status: 'PAGO',
			};
		}
		if (+charge.vencimento > +new Date()) {
			return {
				idDoCliente: charge.id_cliente,
				descricao: charge.descricao,
				valor: charge.valor,
				vencimento: charge.vencimento,
				linkDoBoleto: charge.link_do_boleto,
				status: 'AGUARDANDO',
			};
		}
		return {
			idDoCliente: charge.id_cliente,
			descricao: charge.descricao,
			valor: charge.valor,
			vencimento: charge.vencimento,
			linkDoBoleto: charge.link_do_boleto,
			status: 'VENCIDO',
		};
	});
	const pages = Math.ceil(result.length / cobrancasPorPagina);
	const currentPage = Math.floor(offset / cobrancasPorPagina) + 1;
	return response(ctx, 200, {
		paginaAtual: currentPage,
		totalDePaginas: pages,
		cobranças: [result],
	});
};

/** Função de pagamento de uma cobrança */

const payCharge = async (ctx) => {
	const { idDaCobranca = null } = ctx.request.body;

	const date = new Date();
	const result = await ChargesDB.payForCharge(idDaCobranca, date);

	if (result) {
		return response(ctx, 200, { message: 'Cobrança paga com sucesso' });
	}
	return response(ctx, 503, { message: 'Erro no pagamento' });
};

module.exports = {
	createCharge,
	getCharges,
	payCharge,
};

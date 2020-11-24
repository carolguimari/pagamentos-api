const ClientsDB = require('../repositories/clients');
const response = require('./response');
const Pagarme = require('../integrations/pagarme');

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
	if (charge.includes('ApiError')) {
		return response(ctx, 503, { message: 'Operação não realizada' });
	}

	return response(ctx, 201, {
		cobranca: {
			idDoCliente: id,
			descricao,
			valor,
			vencimento,
			linkDoBoleto: charge.boleto_url,
			status: 'AGUARDANDO',
		},
	});
};

module.exports = { createCharge };

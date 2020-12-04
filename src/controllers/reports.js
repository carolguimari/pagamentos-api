/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
const ChargesDB = require('../repositories/charges');
const response = require('./response');

const clientsReport = new Map();

/** Calcula as cobranças recebidas e pgadas para cada cliente, idenfica status de adimplência e retorna resultados
 * para o controller de clientes
 */

const calculateClientsReport = (nome, email, esta_pago, valor, vencimento) => {
	const findClient = clientsReport.get(nome);

	if (findClient) {
		findClient.cobrancasFeitas += valor;
		esta_pago
			? (findClient.cobrancasRecebidas += valor)
			: findClient.cobrancasRecebidas;
		+vencimento < +new Date()
			? findClient.estaInadimplente
			: !findClient.estaInadimplente;
	} else {
		clientsReport.set(nome, {
			nome,
			email,
			cobrancasFeitas: valor,
			cobrancasRecebidas: esta_pago ? valor : 0,
			estaInadimplente: +vencimento < +new Date(),
		});
	}
};

/** Calcula o relatório geral do usuário indicando cobranças pagas, a pagar, vencidas e quantidade de clientes adimplentes e inadimplentes */

const getReport = async (ctx) => {
	const idUser = ctx.state.id;
	if (!idUser) {
		return response(ctx, 403, {
			message: 'Você precisa fazer login para realizar esta ação',
		});
	}
	const allCharges = await ChargesDB.findAllCharges(idUser);

	let qtdCobrancasPrevistas = 0;
	let qtdCobrancasPagas = 0;
	let qtdCobrancasVencidas = 0;
	let saldoEmConta = 0;

	const allClients = new Set();
	const inadimplentes = new Map();

	for (const charge of allCharges) {
		allClients.add(charge.id_cliente);
		if (charge.esta_pago) {
			qtdCobrancasPagas += 1;
			saldoEmConta += charge.valor;
		} else if (+charge.vencimento > +new Date()) {
			qtdCobrancasPrevistas += 1;
		} else {
			qtdCobrancasVencidas += 1;
			inadimplentes.set(charge.id_cliente, { status: 'inadimplente' });
		}
	}

	let qtdClientesAdimplentes = 0;
	let qtdClientesInadimplentes = 0;

	if (inadimplentes.size === 0) {
		qtdClientesAdimplentes = allClients.size;
	} else {
		qtdClientesInadimplentes = inadimplentes.size;
		qtdClientesAdimplentes = allClients.size - qtdClientesInadimplentes;
	}

	return response(ctx, 200, {
		qtdClientesAdimplentes,
		qtdClientesInadimplentes,
		qtdCobrancasPagas,
		qtdCobrancasPrevistas,
		qtdCobrancasVencidas,
		saldoEmConta,
	});
};

module.exports = { calculateClientsReport, clientsReport, getReport };

const client = require('../integrations/database');

const clientsReport = new Map();

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
			email,
			cobrancasFeitas: valor,
			cobrancasRecebidas: esta_pago ? valor : 0,
			estaInadimplente: +vencimento < +new Date(),
		});
	}
};

module.exports = { calculateClientsReport, clientsReport };

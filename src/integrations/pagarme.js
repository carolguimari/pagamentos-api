const pagarme = require('pagarme');

require('dotenv').config();

/** Função de integração com a PAGAR.ME para gerar transação com boleto bancário */

const payment = async (data) => {
	// eslint-disable-next-line camelcase
	const { name, cpf, amount, boleto_expiration_date } = data;

	const pagarmeClient = await pagarme.client.connect({
		api_key: process.env.PAGARME_API_KEY,
	});

	try {
		const transaction = await pagarmeClient.transactions.create({
			amount,
			payment_method: 'boleto',
			boleto_expiration_date,
			capture: true,
			customer: {
				type: 'individual',
				country: 'br',
				name,
				documents: [
					{
						type: 'cpf',
						number: cpf,
					},
				],
			},
		});
		return transaction;
	} catch (error) {
		return error;
	}
};

module.exports = { payment };

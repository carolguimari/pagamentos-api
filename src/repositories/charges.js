/* eslint-disable camelcase */
const database = require('../integrations/database');

const insertCharge = async (charge) => {
	const {
		id_cliente,
		descricao,
		valor,
		vencimento,
		link_do_boleto,
		codigo_de_barras,
	} = charge;

	const query = {
		text: `INSERT INTO cobrancas (
			id_cliente,
			descricao,
			valor,
			vencimento,
			link_do_boleto,
			codigo_de_barras,
			esta_pago
			
		) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
		values: [
			id_cliente,
			descricao,
			valor,
			vencimento,
			link_do_boleto,
			codigo_de_barras,
			false,
		],
	};
	await database.query(query);

	return 'Cobrança criada com sucesso';
};

module.exports = { insertCharge };

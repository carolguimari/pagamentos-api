/* eslint-disable camelcase */
const database = require('../integrations/database');

/** * Insere uma nova cobrança no banco de dados */

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

/** * Busca cobranças no banco de dados dos clientes de determinado usuário */

const findCharges = async (id_usuario, limit, offset) => {
	const query = {
		text: `SELECT id_cliente, descricao, valor, vencimento, link_do_boleto, esta_pago, data_pagamento from cobrancas 
		INNER JOIN clientes ON cast(cobrancas.id_cliente as integer) = clientes.id
		WHERE clientes.id_usuario = $1 LIMIT $2 OFFSET $3`,
		values: [id_usuario, limit, offset],
	};
	const result = await database.query(query);

	return result.rows;
};

module.exports = { insertCharge, findCharges };

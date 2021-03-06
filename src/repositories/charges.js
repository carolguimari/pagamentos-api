/* eslint-disable camelcase */
const database = require('../integrations/database');

/**  Insere uma nova cobrança no banco de dados */

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
			
		) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`,
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
	const idDaCobranca = await database.query(query);

	return idDaCobranca.rows.shift();
};

/** Busca cobranças no banco de dados dos clientes de determinado usuário */

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

/** Registra a cobrança paga no banco de dados e guarda a data de pagamento  */

const payForCharge = async (id, data_pagamento) => {
	const query = {
		text: `UPDATE cobrancas
		SET esta_pago = $1, data_pagamento = $2
		WHERE id = $3 RETURNING *`,
		values: [true, data_pagamento, id],
	};

	const result = await database.query(query);
	return result.rows.shift();
};

/** Busca as cobranças de detarminado cliente. Para futura atualização da aplicação */

const findChargesPerCliente = async (id_cliente) => {
	const query = {
		text: `SELECT * from cobrancas WHERE id_cliente = $1`,
		values: [id_cliente],
	};
	const result = await database.query(query);
	return result.rows;
};

/** Busca cobranças de todos os clientes de determinado usuário. Utilizada para gerar relatório */

const findAllCharges = async (id_usuario) => {
	const query = {
		text: `SELECT * from cobrancas 
		INNER JOIN clientes ON cast(cobrancas.id_cliente as integer) = clientes.id
		WHERE clientes.id_usuario = $1`,
		values: [id_usuario],
	};
	const result = await database.query(query);

	return result.rows;
};

module.exports = {
	insertCharge,
	findCharges,
	payForCharge,
	findChargesPerCliente,
	findAllCharges,
};

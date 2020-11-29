/* eslint-disable camelcase */
const database = require('../integrations/database');

/** * Insere novo cliente no banco de dados e retorna o seu id, gerado automaticamente */
const insertClient = async (client) => {
	const { id_usuario, nome, cpf, email, tel } = client;
	const query = {
		text: `INSERT INTO clientes (
			id_usuario,
			nome,
			cpf,
			email,
			tel
			
		) VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
		values: [id_usuario, nome, cpf, email, tel],
	};
	const result = await database.query(query);

	return result.rows.shift();
};

/** * Busca cliente no banco de dados a partir do email fornecido */

const getClientByEmail = async (email) => {
	if (!email) {
		return null;
	}

	const query = `SELECT * FROM clientes WHERE email = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [email],
	});

	return result.rows.shift();
};

/** * Busca cliente no banco de dados a partir do id fornecido */
const getClientById = async (id, id_usuario) => {
	if (!id || !id_usuario) {
		return null;
	}
	const query = {
		text: `SELECT * FROM clientes WHERE id = $1 AND id_usuario = $2
		AND deletado = false`,
		values: [id, id_usuario],
	};
	const result = await database.query(query);

	return result.rows.shift();
};

/** Atualizar dados do cliente de determinado usuráio no banco de dados */

const updateClient = async (id_usuario, update) => {
	const { id, nome, cpf, email, tel } = update;
	const query = {
		text: `UPDATE clientes SET nome = $3,
		cpf = $4, email = $5, tel = $6 WHERE id = $1 AND id_usuario = $2
		RETURNING *`,
		values: [id, id_usuario, nome, cpf, email, tel],
	};
	const result = await database.query(query);

	return result.rows.shift();
};

const findClients = async (id_usuario, limit, offset) => {
	const query = {
		text: `SELECT * FROM clientes
		INNER JOIN cobrancas
		ON cast(cobrancas.id_cliente as integer) = clientes.id
		WHERE clientes.id_usuario = $1 LIMIT $2 OFFSET $3`,
		values: [id_usuario, limit, offset],
	};

	const result = await database.query(query);
	return result.rows;
};

module.exports = {
	insertClient,
	getClientByEmail,
	getClientById,
	updateClient,
	findClients,
};

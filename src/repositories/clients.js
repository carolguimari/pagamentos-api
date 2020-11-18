/* eslint-disable camelcase */
const database = require('../utils/database');

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
const getClientById = async (id) => {
	if (!id) {
		return null;
	}

	const query = `SELECT * FROM clientes WHERE id = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [id],
	});

	return result.rows.shift();
};

const updateClient = async (update) => {
	const { id, nome, cpf, email, tel } = update;
	const query = {
		text: `UPDATE clientes SET nome = $2,
		cpf = $3, email = $4, tel = $5 WHERE id = $1
		RETURNING *`,
		values: [id, nome, cpf, email, tel],
	};
	const result = await database.query(query);

	return result.rows.shift();
};

module.exports = {
	insertClient,
	getClientByEmail,
	getClientById,
	updateClient,
};

const database = require('../integrations/database');

/** * Insere novo usuário no banco de dados e retorna o seu id, gerado automaticamente */
const insertUser = async (user) => {
	const { nome, email, senha } = user;
	const query = {
		text: `INSERT INTO usuarios (
			nome,
			email,
			senha
			
		) VALUES ($1, $2, $3) RETURNING id;`,
		values: [nome, email, senha],
	};
	const result = await database.query(query);

	return result.rows.shift();
};

/** * Busca usuário no banco de dados a partir do email fornecido */

const getUserByEmail = async (email) => {
	if (!email) {
		return null;
	}

	const query = `SELECT * FROM usuarios WHERE email = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [email],
	});

	return result.rows.shift();
};
module.exports = { insertUser, getUserByEmail };

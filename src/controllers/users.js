const response = require('./response');
const UsersDB = require('../repositories/users');

/** *
 * Função para criar novo usuário e enviar ao banco de dados. Verifica pré-existência e formata email
 */

const createUser = async (ctx) => {
	const { nome = null, email = null } = ctx.request.body;
	const { hash } = ctx.state;

	if (!nome || !email) {
		return response(ctx, 400, { message: 'Requisição mal formatada' });
	}

	const jaExiste = await UsersDB.getUserByEmail(email);
	if (jaExiste) {
		return response(ctx, 403, { message: 'Usuário já cadastrado' });
	}

	const user = {
		nome,
		email: email.toLowerCase().trim(),
		senha: hash,
	};

	const result = await UsersDB.insertUser(user);
	return response(ctx, 201, result);
};

module.exports = { createUser };

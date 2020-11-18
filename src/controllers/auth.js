const jwt = require('jsonwebtoken');
const comparison = require('../utils/password');
const response = require('./response');
const User = require('../repositories/users');
require('dotenv').config();

const loginUser = async (ctx) => {
	const { email = null, senha = null } = ctx.request.body;
	if (!email || !senha) {
		return response(ctx, 400, { mensagem: 'Requisição mal formatada' });
	}

	const user = await User.getUserByEmail(email);

	const check = await comparison.comparePassword(senha, user.senha);
	if (check) {
		const token = await jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{
				expiresIn: '1d',
			}
		);

		return response(ctx, 200, {
			mensagem: 'Usuário logado com sucesso',
			token,
		});
	}
	return response(ctx, 403, {
		mensagem: 'Email ou senha incorretos',
	});
};

module.exports = { loginUser };

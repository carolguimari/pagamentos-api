const jwt = require('jsonwebtoken');
const response = require('../controllers/response');

require('dotenv').config();

const verificarSessao = async (ctx, next) => {
	const token = ctx.headers.authorization.split(' ')[1];
	if (!token) {
		response(ctx, 403, { message: 'Ação proibida' });
	}
	try {
		const checkToken = await jwt.verify(token, process.env.JWT_SECRET);
		ctx.state.id = checkToken.id;
		ctx.state.email = checkToken.email;
	} catch (err) {
		response(ctx, 403, { message: 'Ação proibida' });
	}

	return next();
};

module.exports = { verificarSessao };

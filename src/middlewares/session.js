const jwt = require('jsonwebtoken');
const response = require('../controllers/response');

require('dotenv').config();

const verifySession = async (ctx, next) => {
	const Token = ctx.headers.authorization;
	if (Token === undefined) {
		return response(ctx, 403, {
			message: 'Para realizar esta ação, faça login',
		});
	}
	// eslint-disable-next-line no-unused-vars
	const [bearer, token] = Token.split(' ');
	try {
		const checkToken = await jwt.verify(token, process.env.JWT_SECRET);
		ctx.state.id = checkToken.id;
		ctx.state.email = checkToken.email;
	} catch (err) {
		response(ctx, 403, { message: 'Ação proibida' });
	}

	return next();
};

module.exports = { verifySession };

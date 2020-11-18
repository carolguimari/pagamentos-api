const response = (ctx, code, dados) => {
	ctx.status = code;
	ctx.body = {
		status: code,
		dados,
	};
};

module.exports = response;

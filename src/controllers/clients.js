/* eslint-disable camelcase */
const ClientsDB = require('../repositories/clients');
const response = require('./response');

const formatarTel = (tel) => {
	const numeros = tel.trim().replace('-', '');
	const telFormatado = numeros.slice(-9);
	return telFormatado;
};

/** Função para criar um novo cliente e enviar ao banco de dados. Verifica email pré-existente e formata dados */

const createClient = async (ctx) => {
	const {
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	const id_usuario = ctx.state.id;
	console.log(ctx.state);

	if (!nome || !cpf || !email || !tel) {
		return response(ctx, 400, { message: 'Requisição mal formatada' });
	}

	const jaExiste = await ClientsDB.getClientByEmail(email);
	if (jaExiste) {
		return response(ctx, 403, { message: 'Cliente já cadastrado' });
	}

	const client = {
		id_usuario,
		nome,
		cpf: cpf.replace('.', '').replace('.', '').replace('-', ''),
		email: email.toLowerCase().trim(),
		tel: formatarTel(tel),
	};

	const result = await ClientsDB.insertClient(client);
	return response(ctx, 201, result);
};

const editClient = async (ctx) => {
	const {
		id = null,
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	const idUser = ctx.state.id;

	if (!id) {
		return response(ctx, 400, {
			message: 'Você precisa informar o id do cliente',
		});
	}

	const client = await ClientsDB.getClientById(id);
	if (!client) {
		return response(ctx, 404, {
			message: 'Cliente não encontrado',
		});
	}

	if (idUser === Number(client.id_usuario)) {
		const update = {
			...client,
			nome: nome || client.nome,
			cpf: cpf
				? cpf.replace('.', '').replace('.', '').replace('-', '')
				: client.cpf,
			email: email ? email.toLowerCase().trim() : client.email,
			tel: tel ? formatarTel(tel) : client.tel,
		};

		const result = await ClientsDB.updateClient(update);
		return response(ctx, 200, result);
	}

	return response(ctx, 403, { message: 'Ação Proibida!' });
};

module.exports = { createClient, editClient };
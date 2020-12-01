/* eslint-disable camelcase */
const ClientsDB = require('../repositories/clients');
const response = require('./response');
const Reports = require('./reports');

/** Função auxiliar para formatar números de telefone antes de salvar no banco de dados */

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
	if (!id_usuario) {
		return response(ctx, 403, {
			message: 'Você precisa fazer login para realizar esta ação',
		});
	}

	if (!nome || !cpf || !email || !tel) {
		return response(ctx, 400, { message: 'Requisição mal formatada' });
	}

	const jaExiste = await ClientsDB.getClientByEmail(email);
	if (jaExiste) {
		return response(ctx, 403, { message: 'Cliente já cadastrado' });
	}

	const newClient = {
		id_usuario,
		nome,
		cpf: cpf.replace('.', '').replace('.', '').replace('-', ''),
		email: email.toLowerCase().trim(),
		tel: formatarTel(tel),
	};

	const result = await ClientsDB.insertClient(newClient);
	return response(ctx, 201, result);
};

/** * Função para editar cliente de determinado usuário */
const editClient = async (ctx) => {
	const {
		id = null,
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;

	const idUser = ctx.state.id;
	if (!idUser) {
		return response(ctx, 403, {
			message: 'Você precisa fazer login para realizar esta ação',
		});
	}

	if (!id) {
		return response(ctx, 400, {
			message: 'Você precisa informar o id do cliente',
		});
	}

	if (!nome) {
		return response(ctx, 400, {
			message: 'Você precisa informar o nome do cliente',
		});
	}

	if (!cpf) {
		return response(ctx, 400, {
			message: 'Você precisa informar o cpf do cliente',
		});
	}

	if (!email) {
		return response(ctx, 400, {
			message: 'Você precisa informar o e-mail do cliente',
		});
	}

	if (!tel) {
		return response(ctx, 400, {
			message: 'Você precisa informar o telefone do cliente',
		});
	}
	const update = {
		id,
		nome,
		cpf: cpf.replace('.', '').replace('.', '').replace('-', ''),
		email: email.toLowerCase().trim(),
		tel: formatarTel(tel),
	};

	const result = await ClientsDB.updateClient(idUser, update);
	if (result) {
		return response(ctx, 200, result);
	}
	return response(ctx, 403, { message: 'Ação Proibida' });
};

/** Função para listar clientes de determinado usuário; todos ou buscando por nome ou e-mail, retornando informações sobre as cobranças de cada */
const getClients = async (ctx) => {
	const { busca = null, clientesPorPagina = 10, offset = 0 } = ctx.query;

	const idUser = ctx.state.id;
	if (!idUser) {
		return response(ctx, 403, {
			message: 'Você precisa fazer login para realizar esta ação',
		});
	}
	if (busca) {
		const clients = await ClientsDB.findClientsByNameOrEmail(
			idUser,
			100,
			offset,
			busca
		);
		if (clients) {
			await clients.forEach((dado) => {
				Reports.calculateClientsReport(
					dado.nome,
					dado.email,
					dado.esta_pago,
					dado.valor,
					dado.vencimento
				);
			});
			const result = Reports.clientsReport;
			const pages = Math.ceil(result.size / clientesPorPagina);
			const currentPage = Math.floor(offset / clientesPorPagina) + 1;
			return response(ctx, 200, {
				paginaAtual: currentPage,
				totalDePaginas: pages,
				clientes: [...result].slice(0, `${clientesPorPagina}`),
			});
		}
		return response(ctx, 404, { message: 'Conteúdo não encontrado' });
	}

	const clients = await ClientsDB.findClients(idUser, 100, offset);
	if (clients) {
		await clients.forEach((dado) => {
			Reports.calculateClientsReport(
				dado.nome,
				dado.email,
				dado.esta_pago,
				dado.valor,
				dado.vencimento
			);
		});
		const result = Reports.clientsReport;
		const pages = Math.ceil(result.size / clientesPorPagina);
		const currentPage = Math.floor(offset / clientesPorPagina) + 1;
		return response(ctx, 200, {
			paginaAtual: currentPage,
			totalDePaginas: pages,
			clientes: [...result].slice(0, `${clientesPorPagina}`),
		});
	}
	return response(ctx, 404, { message: 'Conteúdo não encontrado' });
};

module.exports = { createClient, editClient, getClients };

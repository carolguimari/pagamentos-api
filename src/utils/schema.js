/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const database = require('./database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS usuarios (
			id SERIAL,
			nome TEXT NOT NULL,
			email TEXT NOT NULL,
			senha TEXT NOT NULL,
			deletado BOOL DEFAULT FALSE
	);`,
	2: `CREATE TABLE IF NOT EXISTS clientes (
			id SERIAL,
			id_usuario TEXT NOT NULL,
			nome TEXT NOT NULL,
			cpf VARCHAR(50),
			email TEXT NOT NULL,
			tel VARCHAR(50),
			deletado BOOL DEFAULT FALSE 
	);`,
	3: `CREATE TABLE IF NOT EXISTS cobrancas (
		id SERIAL,
		id_cliente TEXT NOT NULL,
		descricao TEXT NOT NULL,
		valor INTEGER NOT NULL,
		vencimento DATE NOT NULL,
		link_do_boleto TEXT NOT NULL,
		esta_pago BOOL DEFAULT FALSE,
		data_pagamento DATE NOT NULL
	);`,
};

// eslint-disable-next-line no-unused-vars
const drop = async (tableName) => {
	if (tableName) {
		await database.query(`DROP TABLE ${tableName}`);
		console.log('Tabela apagada!');
	}
};

const up = async (number = null) => {
	if (!number) {
		for (const value in schema) {
			// eslint-disable-next-line no-await-in-loop
			await database.query({ text: schema[value] });
		}
	} else {
		await database.query({ text: schema[number] });
	}
	console.log('Migração rodada');
};

up();

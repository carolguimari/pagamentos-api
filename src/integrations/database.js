const { Client } = require('pg');

require('dotenv').config();

const client = new Client({
	connectionString: process.env.URI,
	ssl: {
		rejectUnauthorized: false,
	},
});

client
	.connect()
	.then(() => console.log('connected'))
	.catch((err) => console.error('connection error', err.stack));

module.exports = client;

const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const PORT = process.env.PORT || 8081;
const server = new Koa();
const router = require('./src/routes');

server.use(bodyparser());

server.use(router.routes());

server.listen(PORT, '0.0.0.0', null, () => console.log('Running!'));

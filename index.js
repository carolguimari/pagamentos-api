const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const server = new Koa();
const router = require('./src/routes');

server.use(bodyparser());

server.use(router.routes());

server.listen(8081, () => console.log('Running!'));

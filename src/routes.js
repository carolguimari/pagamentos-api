const Router = require('koa-router');

const router = new Router();

const Payments = require('./controllers/payments');
const Encrypt = require('./middlewares/encrypt');

router.post('/usuarios', Encrypt.encrypt, Payments.createUser);

module.exports = router;

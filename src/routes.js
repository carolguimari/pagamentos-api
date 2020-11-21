const Router = require('koa-router');

const router = new Router();

const Users = require('./controllers/users');
const Encrypt = require('./middlewares/encrypt');
const Clients = require('./controllers/clients');
const Auth = require('./controllers/auth');
const Session = require('./middlewares/session');

router.post('/auth', Auth.loginUser);

router.post('/usuarios', Encrypt.encrypt, Users.createUser);
router.post('/clientes', Session.verifySession, Clients.createClient);
router.put('/clientes', Session.verifySession, Clients.editClient);

module.exports = router;
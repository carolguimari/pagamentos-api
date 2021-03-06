const Router = require('koa-router');

const router = new Router();

const Users = require('./controllers/users');
const Encrypt = require('./middlewares/encrypt');
const Clients = require('./controllers/clients');
const Auth = require('./controllers/auth');
const Session = require('./middlewares/session');
const Charges = require('./controllers/charges');
const Report = require('./controllers/reports');

router.post('/auth', Auth.loginUser);

router.post('/usuarios', Encrypt.encrypt, Users.createUser);
router.post('/clientes', Session.verifySession, Clients.createClient);
router.put('/clientes', Session.verifySession, Clients.editClient);
router.get('/clientes', Session.verifySession, Clients.getClients);
router.post('/cobrancas', Session.verifySession, Charges.createCharge);
router.get('/cobrancas', Session.verifySession, Charges.getCharges);
router.put('/cobrancas', Session.verifySession, Charges.payCharge);
router.get('/relatorios', Session.verifySession, Report.getReport);

module.exports = router;

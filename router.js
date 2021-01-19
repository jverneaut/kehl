const Router = require('express').Router;
const controllers = require('./controllers');

const router = new Router();

router.get('/', controllers.index);
router.post('/', controllers.vote);

module.exports = router;

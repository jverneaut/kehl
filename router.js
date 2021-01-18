const Router = require('express').Router;
const controller = require('./controllers');

const router = new Router();

router.get('/', controller.index);

module.exports = router;

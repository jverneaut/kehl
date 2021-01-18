const Router = require('express').Router;
const controller = require('./controllers');

const router = new Router();

router.get('/', controller.index);
router.post('/', controller.verify);

module.exports = router;

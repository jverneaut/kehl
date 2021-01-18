const recaptcha = require('./services/recaptcha');

const getDefaultParams = res => ({
  recaptcha: res.recaptcha,
  voted: false,
  error: false,
});

module.exports.index = [
  recaptcha.middleware.render,
  (req, res) => {
    res.render('index.twig', { ...getDefaultParams(res) });
  },
];

module.exports.verify = [
  recaptcha.middleware.verify,
  recaptcha.middleware.render,
  (req, res) => {
    if (!req.recaptcha.error) {
      res.render('index.twig', { ...getDefaultParams(res), voted: true });
    } else {
      res.render('index.twig', { ...getDefaultParams(res), error: true });
    }
  },
];

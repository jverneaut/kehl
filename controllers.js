const recaptcha = require('./services/recaptcha');
const { knex } = require('./db');

const getVotes = async () => {
  const today = new Date();
  const todayMinus24Hours = today.setDate(today.getDate() - 1);

  const votes = await knex('votes').where('date', '>=', todayMinus24Hours);

  return votes.reduce(
    (acc, curr) => {
      return curr.is_open == 1 ? [acc[0] + 1, acc[1]] : [acc[0], acc[1] + 1];
    },
    [0, 0]
  );
};

const getDefaultParams = async res => ({
  recaptcha: res.recaptcha,
  voted: false,
  error: false,
  votes: await getVotes(),
});

module.exports.index = [
  recaptcha.middleware.render,
  async (req, res) => {
    const defaultParams = await getDefaultParams(res);

    res.render('index.twig', { ...defaultParams });
  },
];

module.exports.vote = [
  recaptcha.middleware.verify,
  recaptcha.middleware.render,
  async (req, res) => {
    let error = false;

    if (req.recaptcha.error) error = true;

    const vote = req.body.vote;
    if (vote !== 'yes' && vote !== 'no') error = true;

    if (!error) {
      const isOpen = vote === 'yes';
      await knex('votes').insert({
        is_open: isOpen,
        date: new Date(),
      });
      const defaultParams = await getDefaultParams(res);
      const params = { ...defaultParams, voted: true };

      res.render('index.twig', params);
    } else {
      const defaultParams = await getDefaultParams(res);
      const params = { ...defaultParams, error: true };

      res.render('index.twig', params);
    }
  },
];

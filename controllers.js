const recaptcha = require('./services/recaptcha');
const { knex } = require('./db');

const content = require('./content.json');

const getVotes = async () => {
  const today = new Date();
  const todayMinus48Hours = new Date(today.setDate(today.getDate() - 2));

  const count = await knex('votes')
    .count('id as COUNT')
    .first()
    .then(res => res.COUNT);

  const votes = await knex('votes').where('date', '>=', todayMinus48Hours);
  const results = votes.reduce(
    (acc, curr) => {
      return curr.is_open == 1 ? [acc[0] + 1, acc[1]] : [acc[0], acc[1] + 1];
    },
    [0, 0]
  );

  return { count, votes, results };
};

const getContent = results => {
  // Maybe
  if (results[0] === results[1]) {
    return content.maybe[Math.floor(Math.random() * content.maybe.length)];
  }

  // Yes
  if (results[0] > results[1]) {
    return content.yes[Math.floor(Math.random() * content.yes.length)];
  }

  // No
  if (results[0] < results[1]) {
    return content.no[Math.floor(Math.random() * content.no.length)];
  }
};

const getDefaultParams = async res => {
  const votes = await getVotes();
  const content = getContent(votes.results);

  return {
    recaptcha: res.recaptcha,
    voted: false,
    error: false,
    ...votes,
    content,
  };
};

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

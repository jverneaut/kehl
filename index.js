require('dotenv-safe').config();

const app = require('./app');
const { knex } = require('./db');

// Wait for database connection then start the application
knex
  .raw('SELECT 1')
  .then(async () => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`App listening on port ${port}`));
  })
  .catch(err => {
    throw err;
  });

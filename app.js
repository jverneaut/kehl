const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Kehl</h1>');
});

module.exports = app;

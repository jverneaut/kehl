const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const router = require('./router');

// Setup
const app = express();

app.set('view engine', 'twig');
app.use(express.static('dist'));
app.use(express.static('assets/img'));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Routes
app.use(router);

module.exports = app;

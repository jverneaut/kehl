const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');

// Setup
const app = express();

app.set('view engine', 'twig');
app.use(express.static('dist'));
app.use(express.static('assets/img'));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(router);

module.exports = app;

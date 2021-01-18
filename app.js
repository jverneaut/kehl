const express = require('express');
const router = require('./router');

// Setup
const app = express();

app.set('view engine', 'twig');
app.use(express.static('dist'));
app.use(express.static('assets/img'));

// Middlewares

// Routes
app.use(router);

module.exports = app;

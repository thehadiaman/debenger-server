const express = require('express');
const users = require('../routers/users');
const auth = require('../routers/auth');

module.exports = function (app) {
    app.use(express.json());

    app.use('/api/auth', auth);
    app.use('/api/users', users);
}
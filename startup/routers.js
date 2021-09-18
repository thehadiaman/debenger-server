const express = require('express');
const users = require('../routers/users');
const auth = require('../routers/auth');
const debate = require('../routers/debate');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());

    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/debate', debate);
    app.use(error);
}
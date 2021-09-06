const users = require('../routers/users');

module.exports = function (app) {
    app.use('/api/users', users)
}
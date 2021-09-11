const jwt = require('jsonwebtoken');
const Joi = require('joi');

exports.auth = function (req, res, next) {

    const token = req.header('x-auth-token');
    if(!token) return res.status('401').send('Access denied.');

    try {
        const jwtPK = '123'
        const decoded = jwt.verify(token, jwtPK);
        req.user = decoded;
        next();

    } catch (ex) {
        res.status(400).send('Invalid token.');
    }

}


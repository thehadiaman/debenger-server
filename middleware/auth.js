const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {User} = require("../models/users");

exports.auth = async function (req, res, next) {

    const token = req.header('x-auth-token');
    if(!token) return res.status('401').send('Access denied.');

    try {
        const jwtPK = '123'
        const decoded = jwt.verify(token, jwtPK);
        req.user = decoded;

        const user = await User.findOne({_id: decoded._id});
        if(!user) return res.status(400).send('Invalid email or password');

        if(user.password!==decoded.password) return res.status(400).send('Invalid email or password');

        req.user = user
        next();

    } catch (ex) {
        res.status(400).send('Invalid token.');
    }

}


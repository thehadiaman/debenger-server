const Joi = require('joi');

exports.verified = async function (req, res, next) {

    if(!req.user.verified.verified) return res.status(403).send('User not verified yet.')

    next()
}

exports.validateVerification = function (body) {
    const schema = Joi.object({
        verificationCode: Joi.string().min(6).max(1024).required()
    });
    return schema.validate(body);
}
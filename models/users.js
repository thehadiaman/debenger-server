const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const sgMail = require('@sendgrid/mail')
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 225,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: new mongoose.Schema({
            verified: {
                type: Boolean,
                default: false
            },
            code: String,
            error: {
                type: Number,
                min: 0,
                max: 3,
                default: 0
            },
            time: {
                type: Date,
                default: Date.now()
            }
        }),
        default: {verified: false}
    },
    liked: Array,
    following: Array,
    debates: Array
});

userSchema.methods.generateAuthenticationToken = function(){
    const payload = {_id: this._id, name: this.name, isAdmin: this.isAdmin, verified: this.verified.verified , password: this.password};
    const jwsPrivateKey = config.get('jwsPrivateKey');
    return jwt.sign(payload, jwsPrivateKey);
}

userSchema.methods.sendVerificationCode = function(){
    sgMail.setApiKey(config.get('EMAIL_API'))

    const msg = {
        to: this.email,
        from: config.get('EMAIL'),
        subject: 'Debenger account verification code',
        text: 'Debenger - Debating messenger application',
        html: `<p>Your Debenger verificaton code is <u><b>${this.verified.code}</b></u>. </p>`,
    }

    sgMail
        .send(msg)
        .then((response) => {
            return true
        })
        .catch((error) => {
            return false
        })
}

exports.User = mongoose.model('User', userSchema);

exports.validate = function (body) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(10).max(225).email().required(),
        password: Joi.string().min(6).max(1024).required()
    });
    return schema.validate(body)
}

exports.validateAuthDelete = function (body) {
    const schema = Joi.object({
        password: Joi.string().min(6).max(1024).required()
    });
    return schema.validate(body);
}
const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require("jsonwebtoken");


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
    }
});

userSchema.methods.generateAuthenticationToken = function(){
    const payload = {_id: this._id, idAdmin: this.isAdmin};
    const jwsPrivateKey = '123';
    const token = jwt.sign(payload, jwsPrivateKey);
    return token;
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
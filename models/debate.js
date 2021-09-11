const mongoose = require('mongoose');
const Joi = require('joi');

exports.Debate = mongoose.model('Debate', new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 100,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 225,
    },
    tags:{
        type: Array,
        required: true
    },
    participants: {
        type: Array
    },
    like: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now()
    },
    host: {
        type: new mongoose.Schema({
            host: {
                type: String,
                required: true
            }
        })
    }
}));

exports.validate = (body) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(10).max(225),
        tags: Joi.string().min(1).required()
    });
    return schema.validate(body);
}

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
    followers: {
        type: Array
    },
    like: {
        type: new mongoose.Schema({
            lovers: Array,
            likes: Number
        })
    },
    date: {
        type: Date,
        default: Date.now()
    },
    host: {
        type: new mongoose.Schema({
            _id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        })
    },
    messages: {
        type: new mongoose.Schema({
            messenger: {
                type: new mongoose.Schema({
                    _id: {type: String, required: true},
                    name: {type: String, required: true}
                }),
            },
            time: {
                type: Date,
            },
            message: {
                type: String
            }
        })
    }
}));

exports.validate = (body) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        description: Joi.string().min(10).max(225),
        tags: Joi.array().min(1).required()
    });
    return schema.validate(body);
}

exports.validateMessage = (body) => {
    const schema = Joi.object({
        message: Joi.string().min(1).max(1024).required(),
    });
    return schema.validate(body);
}

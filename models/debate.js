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
            },
            email: {
                type: String,
                required: true
            },
            isAdmin: {
                type: Boolean,
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

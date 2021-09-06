const { validate, User } = require('../models/users');
const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async(req, res)=>{
    
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email is already in use.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;

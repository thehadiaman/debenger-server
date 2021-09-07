const { validate, User } = require('../models/users');
const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { auth, validateAuthDelete } = require('../middleware/auth');

router.post('/', async(req, res)=>{
    
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email is already in use.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
    await user.save();

    const token = user.generateAuthenticationToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/', auth, async(req, res)=>{

    const {error} = validateAuthDelete(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({_id: req.user._id});
    if(!user) return res.status(400).send('Invalid credentials.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid credentials..')

    await User.findOneAndDelete({_id: req.user._id});
    
    res.send(user);
})

module.exports = router;

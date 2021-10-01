const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/users');
const router = require('express').Router();
const _ = require('lodash');

router.post('/', async(req, res)=>{

    const {error} = validateAuth(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthenticationToken()

    res
    .header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ['_id', 'name', 'email']));

});

function validateAuth(body){
    const schema = Joi.object({
        email: Joi.string().min(10).max(50).required().email(),
        password: Joi.string().min(6).max(1024).required()
    });

    return schema.validate(body);
}

module.exports = router;

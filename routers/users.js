const {validate, User, validateAuthDelete} = require('../models/users');
const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {auth} = require('../middleware/auth');
const {verified, validateVerification} = require("../middleware/verification");


router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send('Email is already in use.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.verified.code = Math.floor(Math.random() * 1000000);
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10));
    user.sendVerificationCode();

    await user.save();

    const token = user.generateAuthenticationToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.get('/getVerificationCode', auth, async(req, res)=>{
    const user = await User.findOne({_id: req.user._id});
    if(user.verified.verified) return res.send('verified user');

    if((new Date().getMinutes()-user.verified.time.getMinutes())<=2) return res.status(403).send('Must wait at least 2 minutes for next code.')

    user.verified.code = Math.floor(Math.random() * 1000000)
    user.verified.time = Date.now();
    user.save()
    user.sendVerificationCode()
    res.send(true);
});

router.post('/verification', auth, async(req, res)=>{

    const {error} = validateVerification(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({_id: req.user._id});

    if(user.verified.verified) return res.send('verified user');

    if(req.body.verificationCode !== user.verified.code){
        user.verified.error += 1;
        if(user.verified.error>=3){
            user.verified.error = 0
            user.verified.code = Math.floor(Math.random() * 1000000);
            user.verified.time = Date.now();
            await user.save();
            user.sendVerificationCode()
            return res.send('3 attempt failed, new verification code available');
        }
        await user.save();
        return res.send(`${user.verified.error} attempt failed, try again.`);
    }

    user.verified.verified = true
    user.verified.error = null
    user.save();

    res.send(user);

});

router.delete('/', [auth, verified], async (req, res) => {
    const {
        error
    } = validateAuthDelete(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({
        _id: req.user._id
    });
    if (!user) return res.status(400).send('Invalid credentials.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials..')

    await User.findOneAndDelete({
        _id: req.user._id
    });

    res.send(user);
})

module.exports = router;
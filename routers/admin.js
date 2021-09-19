const {auth} = require("../middleware/auth");
const {admin} = require("../middleware/admin");
const {User} = require("../models/users");
const _ = require("lodash/fp");
const {Debate} = require("../models/debate");
const mongoose = require("mongoose");
const params = require("../middleware/params");
const router = require('express').Router();

router.get('/users', [auth, admin], async(req, res)=>{

    const users = await User.find();

    res.send(_.pick(users, ['_id', 'name', 'email', 'isAdmin', 'verified.verified', 'liked', 'following', 'debates']));

});

router.get('/debates', [auth, admin], async(req, res)=>{

    const debates = await Debate.find();

    res.send(_.pick(debates, ['title', 'description', 'tags', 'followers', 'like', 'date', 'host.name']))

});

router.delete('/users/:id', [auth, admin, params], async(req, res)=>{

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid param');

    await User.findByIdAndRemove(req.params.id);

    res.send('Debate deleted');

});

router.delete('/debates/:id', [auth, admin, params], async(req, res)=>{

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('Invalid param');

    await Debate.findByIdAndRemove(req.params.id);

    res.send('Debate deleted');

});

module.exports = router;

const {auth} = require("../middleware/auth");
const {admin} = require("../middleware/admin");
const {User} = require("../models/users");
const _ = require("lodash");
const {Debate} = require("../models/debate");
const mongoose = require("mongoose");
const {params} = require("../middleware/params");
const router = require('express').Router();

router.get('/users', [auth, admin], async(req, res)=>{

    const users = await User.aggregate([
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                isAdmin: 1,
                'verified.verified': 1,
                liked: 1,
                following: 1,
                debates: 1
            }
        }
    ]);

    res.send(users);

});

router.get('/debates', [auth, admin], async(req, res)=>{

    const debates = await Debate.aggregate([
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                tags: 1,
                'host.name': 1,
                followers: 1,
                date: 1,
                like: 1,
                messages: 1
            }
        }
    ]);

    res.send(debates);

});

router.delete('/users/:id', [auth, admin, params], async(req, res)=>{

    await User.findByIdAndRemove(req.params.id);

    res.send('Debate deleted');

});

router.delete('/debates/:id', [auth, admin, params], async(req, res)=>{

    await Debate.findByIdAndRemove(req.params.id);

    res.send('Debate deleted');

});

module.exports = router;

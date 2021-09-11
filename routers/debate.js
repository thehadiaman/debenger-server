const router = require('express').Router();
const {User} = require("../models/users");
const {Debate, validate} = require("../models/debate");
const {auth} = require("../middleware/auth");
const {v4} = require("uuid");
const _ = require('lodash');

let csrfToken;

router.get('/csrf', auth, (req, res)=>{
    csrfToken = v4();
    res.send({csrfToken: csrfToken});
});

router.post('/', auth, async(req, res)=>{
    if(csrfToken !== req.header('x-csrf-token')) return res.status(400).send('Invalid CSRF Token.');
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const debate = new Debate({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        host: req.user
    });
    await debate.save();
    res.send(debate);
});

router.get('/participate/:id', auth, async(req, res)=>{

    const debate = await Debate.findOne({_id: req.params.id});
    if(!debate) return res.status(400).send('No debate found.');

    const user = await Debate.findOne({participants: {$in: _.pick(req.user, ['_id', 'name', 'email', 'isAdmin'])}});
    if(user) return res.status(400).send('Already a participant in the debate.');

    await Debate.findByIdAndUpdate(req.params.id, {
        $push: {participants: _.pick(req.user, ['_id', 'name', 'email', 'isAdmin'])}
    })

    res.send(req.user)

});

module.exports = router;
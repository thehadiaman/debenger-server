const router = require('express').Router();
const {Debate, validate, validateMessage} = require("../models/debate");
const {auth} = require("../middleware/auth");
const _ = require('lodash');
const mongodb = require("mongodb");

router.post('/', auth, async(req, res)=>{
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

router.get('/follow/:id', auth, async(req, res)=>{

    const debate = await Debate.findOne({_id: req.params.id});
    if(!debate) return res.status(400).send('No debate found.');

    const user = await Debate.findOne({participants: {$in: _.pick(req.user, ['_id', 'name', 'email'])}});
    if(user) return res.status(400).send('Already a participant in the debate.');

    await Debate.findByIdAndUpdate(req.params.id, {
        $push: {followers: _.pick(req.user, ['_id', 'name', 'email'])}
    });

    res.send(req.user);

});

router.get('/like/:id', auth, async(req, res)=>{

    const debate = await Debate.findOne({_id: req.params.id});
    if(!debate) return req.status(400).send('No debate found.');

    const user = await Debate.findOne({'like.lovers': {$in: _.pick(req.user, ['_id', 'name', 'email'])}});
    if(user){
        await Debate.findByIdAndUpdate(req.params.id, {
            $pull: {'like.lovers': _.pick(req.user, ['_id', 'name', 'email'])}, $inc: {'like.likes': -1}});
        return res.send(`Unliked debate ${debate.title}`);
    }
    await Debate.findByIdAndUpdate(req.params.id, {
        $push: {'like.lovers': _.pick(req.user, ['_id', 'name', 'email'])}, $inc: {'like.likes': 1}});
    res.send(`Liked debate ${debate.title}`);
});

router.post('/message/:id', auth, async(req, res)=>{

    const debate = await Debate.findOne({_id: req.params.id});
    if(!debate) return res.status(400).send('No debate found.');

    const {error} = validateMessage(_.pick(req.body, ['message']));
    if(error) return res.status(400).send(error.details[0].message);

    await Debate.findByIdAndUpdate(req.params.id, {
        $push: {messages: {messenger:{_id: req.user._id, name: req.user.name}, message: req.body.message} }});
    res.send(`${req.body.message}`);

});

router.get('/', async(req, res)=>{

    const debate = await Debate.aggregate([
        {
            $project: {
                _id: 0,
                title: 1,
                description: 1,
                tags: 1,
                followers: 1,
                date: 1,
                host: 1,
                messages: 1
            }
        }
    ]);

    res.send(debate);

});

module.exports = router;
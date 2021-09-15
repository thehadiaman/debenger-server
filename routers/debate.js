const router = require('express').Router();
const {Debate, validate, validateMessage} = require("../models/debate");
const {auth} = require("../middleware/auth");
const _ = require('lodash');
const {verified} = require("../middleware/verification");
const {follower} = require("../middleware/follower");


router.post('/', auth, verified, async(req, res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const debate = new Debate({
        title: req.body.title,
        description: req.body.description,
        host: _.pick(req.user, ['_id','name'])
    });
    debate.tags = req.body.tags;
    debate.followers.push(_.pick(req.user, ['_id', 'name']));
    await debate.save();
    res.send(debate);
});

router.get('/follow/:id', auth, verified, async(req, res)=>{

    const debate = await Debate.findOne({_id: req.params.id});
    if(!debate) return res.status(400).send('No debate found.');

    const user = await Debate.findOne({followers: {$in: _.pick(req.user, ['_id', 'name'])}});
    if(user) return res.status(400).send('Already a followed the debate.');

    await Debate.findByIdAndUpdate(req.params.id, {
        $push: {followers: _.pick(req.user, ['_id', 'name'])}
    });

    res.send(req.user);

});

router.get('/like/:id', [auth, verified], async(req, res)=>{

    const debate = await Debate.findOne({_id: req.params.id});
    if(!debate) return req.status(400).send('No debate found.');

    const user = await Debate.findOne({'like.lovers': {$in: _.pick(req.user, ['_id', 'name'])}});
    if(user){
        await Debate.findByIdAndUpdate(req.params.id, {
            $pull: {'like.lovers': _.pick(req.user, ['_id', 'name'])}, $inc: {'like.likes': -1}});
        return res.send(`Unliked debate ${debate.title}`);
    }
    await Debate.findByIdAndUpdate(req.params.id, {
        $push: {'like.lovers': _.pick(req.user, ['_id', 'name'])}, $inc: {'like.likes': 1}});
    res.send(`Liked debate ${debate.title}`);
});

router.post('/message/:id', [auth, verified, follower], async(req, res)=>{

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
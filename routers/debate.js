const router = require('express').Router();
const {User} = require("../models/users");
const {Debate, validate} = require("../models/debate");
const {auth} = require("../middleware/auth");
const {v4} = require("uuid");

let csrfToken;

router.get('/csrf', auth, (req, res)=>{
    csrfToken = v4();
    res.send({csrfToken: csrfToken});
});

router.post('/', auth, async(req, res)=>{
    if(csrfToken !== req.header('x-auth-csrf')) return res.status(400).send('Invalid CSRF Token');
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({_id: req.user._id});
    if(!user) return res.status(400).send('No use found.');

    const debate = new Debate({
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        host: req.user.id
    });
    await debate.save();
    res.send(debate);
});


module.exports = router;
const {Debate} = require("../models/debate");
const _ = require("lodash");

exports.follower = async function (req, res, next) {
    const user = await Debate.findOne({followers: {$in: _.pick(req.user, ['_id', 'name'])}});
    if(user) return next();

    res.status(400).send('Not followed the debate.');
}
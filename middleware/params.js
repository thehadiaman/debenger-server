const {Types} = require("mongoose");
exports.params = function (req, res, next) {
    if(!Types.ObjectId.isValid(req.query.id || req.params.id)) return res.status(400).send('invalid parameter');
    next();
}
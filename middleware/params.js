const {Types} = require("mongoose");
exports.params = function (req, res, next) {
    if(!Types.ObjectId.isValid(req.params.id)) return res.status(400).send('invalid parameter');
    next();
}
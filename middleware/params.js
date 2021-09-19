import mongoose from "mongoose";

exports.params = function (req, res, next) {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send('invalid parameter');
    next();
}
exports.admin = function (req, res, next) {
    if(!req.user.isAdmin) return res.status(401).send('Access not authorized');
    next()
}
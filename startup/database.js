const {
    connect
} = require("mongoose");

module.exports = function () {
    connect('mongodb://127.0.0.0:27017/debenger')
        .then(() => {
            console.log('MongoDB connection successful.');
        }).catch(() => {
            console.log('MongoDB connection is failed');
        })
}
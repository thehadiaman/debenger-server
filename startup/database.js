const config = require('config');
const app = require('express')();

const {
    connect
} = require("mongoose");

const uri = app.get('env')==='production' ? config.get('DB_SERVER'): config.get('DBS');

console.log(uri)
module.exports = function () {
    connect(uri)
        .then(() => {
            console.log('MongoDB connection successful.');
        }).catch(() => {
        console.log('MongoDB connection is failed');
    })
}
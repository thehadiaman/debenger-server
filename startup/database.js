const config = require('config');
const app = require('express')();

const {
    connect
} = require("mongoose");

const uri = app.get('env')==='production' ? config.get('PROD_DB'): config.get('DEV_DB');

module.exports = function () {
    connect(uri)
        .then(() => {
            console.log('MongoDB connection successful.');
        }).catch(() => {
        console.log('MongoDB connection is failed');
    })
}
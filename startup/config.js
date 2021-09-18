const config = require('config');

module.exports = function () {
    if(!config.get('jwsPrivateKey')) throw new Error('FATAL ERROR: jwsPrivateKey is not defined');
    if(!config.get('EMAIL_API')) throw new Error('FATAL ERROR: EMAIL_API is not defined');
    if(!config.get('EMAIL')) throw new Error('FATAL ERROR: EMAIL is not defined');
}
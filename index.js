global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const app = require('express')();

// Logging errors
require('./startup/logging.js')()

// An error will throw if custom environment variables is not defined
require('./startup/config.js')();

// Connecting to mongodb
require('./startup/database')();

// Setup routes
require('./startup/routers')(app);

app.listen(process.env.debenger_PORT || 3000, ()=>{
    console.log(`Listening in port ${process.env.debenger_PORT || 3000}`);
});

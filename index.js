global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const app = require('express')();
require('express-async-errors');

// Logging errors
require('./startup/logging.js')()

// An error will throw if custom environment variables is not defined
require('./startup/config.js')();

// Connecting to mongodb
require('./startup/database')();

// Setup routes
require('./startup/routers')(app);

// Setup for production
require('./startup/prod')(app);

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Listening in port ${process.env.PORT || 3000}`);
});

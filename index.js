global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
const app = require('express')();


// Connecting to mongodb
require('./startup/database')();

// Setup routes
require('./startup/routers')(app);

app.listen(process.env.debenger_PORT || 3000, ()=>{
    console.log(`Listening in port ${process.env.debenger_PORT || 3000}`);
});

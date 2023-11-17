const express = require('express');
const mysql2 = require('mysql2')
const cors = require('cors');
const routes = require('./src/routes');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static("."));
app.listen(5000, () => {
    console.log('Server run 5000');
})


// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure


app.use('/api/v1', routes)



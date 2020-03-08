const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const http = require('http');
const path = require('path');

const port = 8020;

const {getHomePage,getOrigin,getDestination,getDepart,getPassenger,getflight,getcheckout,bookFlight} = require('./routes/index');

const db = mysql.createConnection ({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'development'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use( express.static( "public" ) );


app.get('/',getHomePage);
app.get('/origin',getOrigin);
app.get('/destination',getDestination);
app.get('/departure',getDepart);
app.get('/passenger',getPassenger);
app.get('/flight',getflight);
app.get('/checkoutpage',getcheckout);
app.get('/booking',bookFlight);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

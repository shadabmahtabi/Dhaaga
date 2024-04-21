const express = require('express');
const app = express();

// For initializing environment variables i.e., PORT, etc.
require('dotenv').config();

// db connection
require('./models/database').connectDatabase();

// For showing logs
/*
    It shows which route is being used and when it's called.
*/
const logger = require('morgan');
app.use(logger('dev'));

// BodyParser - Parsing the request body
/*
    This middleware is responsible for parsing incoming requests 
    and populating req.body with any data sent in a JSON payload.  
    If the Content-Type of the request is application/x-www-form-urlencoded,  
    then the middleware will parse the content of this request to make it available as params on the req.body object.
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session and cookie
const expressSession = require('express-session');
var cookieparser = require('cookie-parser')
app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    secret: process.env.EXPRESS_SESSION_SECRET
}))
app.use(cookieparser())

// Importing routes from other files
const indexRoutes = require('./routes/indexRouter');
// const userRoutes = require('./routes/user-router');


// Assigning / route for indexRouter
app.use('/', indexRoutes)

// Error Handling
const ErrorHandler = require('./utils/ErrorHandler');
const { generatedErrors } = require('./middlewares/error');
/*
404 - Page not found error
The server could not find the requested resource. 
*/
app.all( '*', (req, res, next) => {
    next(new ErrorHandler("Requested Url Not Found", 404))
});
  
// Adding middleware to handle any errors that occur in our application
/*
    Any unhandled errors will be caught here and the following data will be sent:
        .message: A short description of the error.
        .status: The HTTP status code to send with the response.
*/
app.use(generatedErrors);


// Setting up server port and listening on
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on PORT ${process.env.PORT}`)
})

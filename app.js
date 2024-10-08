const express = require('express');
const app = express();
const cors = require('cors')

// For initializing environment variables i.e., PORT, etc.
require('dotenv').config();

// db connection
require('./models/database').connectDatabase();

// enabling cors policy
app.use(cors());

// For showing logs
const logger = require('morgan');
app.use(logger('dev'));

// BodyParser
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
const adminRoutes = require('./routes/adminRouter');
const designerRoutes = require('./routes/designerRouter');

// Assigning / route for indexRouter
app.use('/', indexRoutes)
app.use('/admin', adminRoutes);
app.use('/designer', designerRoutes);

// Error Handling
const ErrorHandler = require('./utils/ErrorHandler');
const { generatedErrors } = require('./middlewares/error');
app.all( '*', (req, res, next) => {
    next(new ErrorHandler("Requested Url Not Found", 404))
});
  
// Adding middleware to handle any errors that occur in our application
app.use(generatedErrors);


// Setting up server port and listening on
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on PORT ${process.env.PORT}`)
})

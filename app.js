const express = require('express');
const morgan = require('morgan');
const app = express();
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const userRouter = require('./routes/userRoutes')
const authController = require('./controllers/authController')
const googleAuthController = require('./routes/authRoutes')
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Implement CORS
// Access-Control-Allow-Origin *
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/login', authController.login)
app.use('/api/v1/logout', authController.logout)
app.use('/api/v1/user', userRouter)
app.use('/api/v1', googleAuthController)
module.exports = app;

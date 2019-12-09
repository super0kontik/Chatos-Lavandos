const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const app = express();
const passport = require('passport');
const mainRouter = require('./routers/main');
const authRouter = require('./routers/auth');
app.use(bp.json());
app.use(bp.urlencoded({extended:false}));
app.use(cors());
app.use(passport.initialize());
app.disable('x-powered-by');
app.use('/auth', authRouter);
app.use('/',mainRouter);

module.exports = app;

const express = require('express');
const userRouter = require('./routes/users');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use(userRouter);
    return app;
}
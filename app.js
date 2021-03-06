// modules importation
const express = require('express');
const app = express();

// middlewares
app.use(express.json());

// routes
app.use(require('./routes/user'));
app.use(require('./routes/post'));
app.use(require('./routes/auth'));

if (process.env.NODE_ENV=="production") {
    app.use(express.static('frontend/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    });
};

// settings
app.set('port', process.env.PORT || 5000);

module.exports = app;

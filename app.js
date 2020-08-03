// modules importation
const express = require('express');
const app = express();
const cors = require('cors');

if (process.env.NODE_ENV=="production") {
    app.use(express.static('frontend/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

// settings
app.set('port', process.env.PORT || 5000);

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use(require('./routes/user'));
app.use(require('./routes/post'));
app.use(require('./routes/auth'));

module.exports = app;

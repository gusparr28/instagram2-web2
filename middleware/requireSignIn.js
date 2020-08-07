const jwt = require('jsonwebtoken');
const {  } = require('../config/keys');

const User = require('../models/User');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must be signed in" });
    } else {
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "You must be signed in" });
            } else {
                const { _id } = payload;
                User.findById(_id)
                    .then(userData => {
                        req.user = userData
                        next();
                    });
            };
        });
    };
};

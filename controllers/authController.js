const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

const authController = {};

const User = require('../models/User');

authController.signUpUser = (req, res) => {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please complete all fields" });
    } else {
        User.findOne({ email })
            .then(savedUser => {
                if (savedUser) {
                    return res.status(422).json({ error: "User already exists" });
                } else {
                    bcrypt.hash(password, 12)
                        .then(async hashedPassword => {
                            const newUser = new User({
                                name,
                                email,
                                password: hashedPassword,
                                image
                            });
                            await newUser.save();
                            res.json({ message: "User succesfully signed up" });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                };
            })
            .catch(err => {
                console.error(err);
            });
    };
};

authController.signInUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please complete all fields" });
    } else {
        User.findOne({ email })
            .then(savedUser => {
                if (!savedUser) {
                    return res.status(422).json({ error: "Invalid credentials" });
                } else {
                    bcrypt.compare(password, savedUser.password)
                        .then(correctCreds => {
                            if (correctCreds) {
                                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                                const { _id, name, email, followers, following, image } = savedUser;
                                res.json({ token, user: { _id, name, email, followers, following, image } });
                            } else {
                                return res.status(422).json({ error: "Invalid credentials" });
                            };
                        })
                        .catch(err => {
                            console.error(err);
                        });
                };
            })
            .catch(err => {
                console.log(err);
            });
    };
};

module.exports = authController;

const { Router } = require('express');
const router = Router();

const { signInUser, signUpUser } = require('../controllers/authController');

router.route('/signup')
    .post(signUpUser)

router.route('/signin')
    .post(signInUser)

module.exports = router;

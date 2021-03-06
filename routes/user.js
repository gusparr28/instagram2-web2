const { Router } = require('express');
const router = Router();

const requireSignIn = require('../middleware/requireSignIn');

const { getUserProfile, followUser, unfollowUser, updatePhoto, searchUsers } = require('../controllers/userController');

router.route('/user/:id')
    .get(requireSignIn, getUserProfile)

router.route('/follow')
    .put(requireSignIn, followUser)

router.route('/unfollow')
    .put(requireSignIn, unfollowUser)

router.route('/updatePhoto')
    .put(requireSignIn, updatePhoto)

router.route('/searchUsers')
    .post(requireSignIn, searchUsers)
    
module.exports = router;

const postController = {};

const Post = require('../models/Post');

postController.createPost = async (req, res) => {
    const { title, description, image } = req.body;
    if (!title || !description || !image) {
        return res.status(422).json({ error: "Please complete all fields" });
    } else {
        req.user.password = undefined;
        const newPost = new Post({
            title,
            description,
            image,
            author: req.user
        });
        const result = await newPost.save();
        res.json({ post: result });
    };
};

postController.getPosts = (req, res) => {
    Post.find()
        .populate("author", "_id name")
        .populate("comments.author", "_id name")
        .then(posts => res.json({ posts }))
        .catch(err => console.error(err));
};

postController.getUserPosts = (req, res) => {
    Post.find({ author: req.user._id })
        .populate("author", "_id name")
        .then(userPosts => {
            res.json({ userPosts })
        })
        .catch(err => {
            console.log(err);
        });
};

postController.likePosts = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
};

postController.unlikePosts = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
};

postController.commentPosts = (req, res) => {
    const comments = {
        text: req.body.text,
        author: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments }
    }, {
        new: true
    }).populate("comments.author", "_id name")
        .populate("author", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            };
        });
};

postController.deletePosts = (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("author", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.author._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    }).catch(err => console.error(err));
            };
        });
};

postController.getFollowingPosts = (req, res) => {
    Post.find({ author: { $in: req.user.following } })
        .populate("author", "_id name")
        .populate("comments.author", "_id name")
        .then(posts => res.json({ posts }))
        .catch(err => console.error(err));
};

module.exports = postController;

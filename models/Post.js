const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
    comments: [{
        text: String,
        author: {
            type: ObjectId,
            ref: "User"
        }
    }],
    author: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = model('Post', postSchema);

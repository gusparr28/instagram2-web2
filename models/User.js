const { Schema, model } = require('mongoose');
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/instagram-web2/image/upload/v1596229249/unnamed_q4rlmp.png"
    },
    followers: [{
        type: ObjectId, 
        ref: "User"
    }],
    following:[{
        type: ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

module.exports = model('User', userSchema);

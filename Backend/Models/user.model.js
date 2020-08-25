//User model contains all the user profile information, user tweets are stored in another collection in an array

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//TODO : fix issue where field that are required arent actually
const post = Schema({
    message : {
        type : String,
        required : true
    },
    //If true then the message will be formatted as a tweet
    isRetweet : {
        type: Boolean,
        required : true,
        default : false,    
    },
    user : {
        type : String,
        required : true
    },
    attachedPhotos : {
        type : [String],
        required : false,
        default : []
    },
    replies : {
        type : [String],
        required : false
    }},{
        timestamps:true,
    }
);

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        text: true //creates text index to use $text with 
    },
    displayName : {
        type: String,
        required: true,
        unique: false,
        trim: true,
        minlength: 1,
    },
    description : {
        type: String,
        required: false,
        unique : false,
        trim : false,
        maxlength : 128,
        default : ""
    },
    location : {
        type: String,
        required: false,
        unique : false,
        trim : false,
        maxlength : 128,
        default : ""
    },
    website : {
        type: String,
        required: false,
        unique : false,
        trim : false,
        maxlength : 128,
        default : ""
    },
    tweets : {
        type : [post],
        default : [],
        required: false,
    },
    replies : {
        type : [String],
        required : false,
        unique : false,
        maxlength : 128,
        default : []
    },
    likes : {
        type : [String],
        required : false,
        default : []
    },
    profilePhotoPath : {
        type : String,
        required : false,
        default : ""
    },
    coverPhotoPath : {
        type : String,
        required : false,
        default : ""
    },
    uploadedPhotos : {
        type : [String],
        required : false,
        default : []
    },
    following: {
        type : [String],
        required : false,
        default : []
    },
    followers : {
        type : [String],
        required : false,
        default : []
    },
},{
    timestamps:true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
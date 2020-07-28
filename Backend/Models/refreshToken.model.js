//Stores refreshToken keys

//User model contains all the user profile information, user tweets are stored in another collection in an array

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    key : {
        type : String,
        required : true,
        unique: true,
    }},{
        timestamps:true,
    });
    
const refreshTokenStored = mongoose.model('RefreshTokens', refreshTokenSchema);
module.exports = refreshTokenStored;
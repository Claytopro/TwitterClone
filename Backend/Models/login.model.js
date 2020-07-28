//Schemas used to validate users during login attempt
// associated id will be used for validation

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    email : {
        type : String,
        required : true,
        unique : false,
    },
    password : {
        type : String,
        required : true,
        minlength : 3
    },
    isAdmin : {
        type : Boolean,
        required : true,
        default : false
    },
},
    {
        timestamps:true,
});

const LoginValidation = mongoose.model('LoginValidation', loginSchema);

module.exports = LoginValidation;
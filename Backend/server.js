require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload'); // middleware to parse incoming multipar/form-data
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json())

//const uri = process.env.DATABASE_URI;
const uri = "mongodb://localhost:27017/TwitterClone";
mongoose.connect(uri,{useNewUrlParser:true, useCreateIndex: true , useUnifiedTopology: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDb database connection establised")
})

//handles user login and session tokens
const loginRouter = require('./routes/login');
//handles main website exploration
const exploreUsers = require('./routes/explore');
//handles file uploads
const update = require('./Routes/update');

app.use('/login',loginRouter)
app.use('/',exploreUsers)
app.use('/update',update) 

app.listen(port,() => {
    console.log(`Server is running on port : ${port}`);
})
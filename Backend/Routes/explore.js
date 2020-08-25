//serves user profiles and main screen highlighted tweets
const router = require('express').Router();
let User = require('../Models/user.model');
require('dotenv').config();

router.route('/explore').get((req, res) => {
    
   //sends index.js

    res.send('Main Page')
})

router.route('/:user').get((req, res) => {
    User.find({username: req.params.user}, 
        //TODO : handle error 
        function(err,docs){
            if(docs.length > 0) {
                res.status(200).json(docs[0])
            }else{
                //create new user and send blank w/ username
                const username = req.params.user;
                const description = "User does not exist"
                const invalidUser = new User({
                    username,
                    description,
                  });
                res.status(403).json(invalidUser)
            }
        })
})



module.exports = router;
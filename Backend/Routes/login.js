const jwt = require('jsonwebtoken')
const router = require('express').Router();
let LoginValidation = require('../Models/login.model');
let User = require('../Models/user.model');
let refreshTokenStored = require('../Models/refreshToken.model');


require('dotenv').config();


//Route to allow user to login 
// returns AccessToken for user
router.route('/').post((req,res) => {
    //console.log('reqest atetmp' + JSON.stringify(req.body));
  
    const user =  { 
      username: req.body.username,
     }

    let accessToken = null;
    let refereshToken = null;

    
    //find user in database and return authentication token and refresh token to user
     LoginValidation.find({username: req.body.username , password : req.body.password},
      function(err,docs) {
        if(docs.length > 0) {
          //create tokens for user and send them back to user
          accessToken = generateAccessToken(user)
          refereshToken = jwt.sign(user,process.env.REFRESH_TOKEN)
          addRefreshToken(refereshToken)

          res.status(200).json({accessToken: accessToken, refreshToken: refereshToken})
        }else{
          res.status(400).json("invalid login information")
        }
     }).catch(err => res.status(400).json('Error from login.js \'/\' : ' + err));
     
});

//TODO: add error handling
//creates and adds Refresh Token to database
function addRefreshToken(tokenToAdd){
  
  const refreshToken = new refreshTokenStored ({
    key : tokenToAdd,
  })

  refreshToken.save()
}

//TODO: add error handling
function removeRefreshToken(tokenToRemove){
  refreshTokenStored.findOneAndDelete({key : tokenToRemove}, function(err,docs){
    console.log('token removed ' + docs );
  })
}

//Creates Authorization tokent that is sent to user with a expiration time
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}


router.route('/refreshToken').post((req,res) =>{
    const refreshToken = req.body.refereshToken
    if(refreshToken == null) return res.sendStatus(401)
    //TODO: TEST THIS
    //check if refresh tokens is invalid 
    if(!refreshTokenStored.find({key : req.body.refereshToken}, function(err,docs){ if(docs.length > 0 ) return true} )) return res.sendStatus(403)

    jwt.verify(refereshToken,process.env.REFRESH_TOKEN,(err,user)=>{
        const accessToken = generateAuthToken({name : user.name})
       // res.json({accessToken:accessToken})
    })
})

//remove user's refresh token from valid token collection in database
router.route('/logout').delete((req,res) =>{
  removeRefreshToken(req.body.refereshToken)
  res.sendStatus(203)
})

//creates user login information and instantiates user in users collection
router.route('/register').post((req,res) => {
    const username = req.body.username.trim();
    const email = req.body.email;
    const password = req.body.password;  

    const newLogin = new LoginValidation({
        username,
        email,
        password,
    });

    const newUser = new User({
      username,
    });

   
    newLogin.save(function(err,doc){
      if(!err){
        newUser.save(function(err,docs){
          if(!err){
            res.json('User Created')
          }else{
            newLogin.findOneAndDelete({username:username}, function(err,docs){
              console.log("successfully aborted registration");
            })
            res.json('Error:' + err)
          }
        })
      }else{
        res.json('Error:' + err)
      }
    })
    
});

// middleware function that validates the incoming requests AccessToken
function authenticateToken(req,res,next) {
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err) return res.sendStatus(403)
        //console.log('authentok func: ' + user.name);
         
        req.user = user 
        next()
    })
}

module.exports = router;
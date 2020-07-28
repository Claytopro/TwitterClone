const jwt = require('jsonwebtoken'); // validating user 
const router = require('express').Router();
const shortid = require('shortid');
const _ = require('lodash');
require('dotenv').config();
let User = require('../Models/user.model');

/*
this route requires ('express-fileupload') to be used in app to function
*/

//POST request for uploading and changing user's profile photo
router.route('/avatar').post((req, res) => {
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    //if no token is sent we end request and return error
    if(token == null) return res.sendStatus(401).json({message : "lack permission"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(!err){
            let username = user.username

            //TODO : check if only one file is being uploaded, look at tweet post request because i did it there

            let fileExtension = req.files.file.name.split('.')[1]
            let filename = shortid.generate().toString().concat('.' +fileExtension)
        
            User.updateOne({username:username},{$push: {uploadedPhotos: filename} ,profilePhotoPath: filename},function(err){
                if(!err){
                    //save uploaded file to uploads directory with create 'unique' file name
                    let file = req.files.file
                    file.mv('./uploads/'+username+ '/' + filename)

                    res.sendStatus(200)
                }else{
                    res.sendStatus(403).json('Error:' + err)
                }
            })
        }else{
            console.log("Error from uploads route /:" + err);
            return res.sendStatus(403)
        }
    })
 })


//POST request for adding a tweet to database, User identity taken from authentication token
 router.route('/tweet_deprecated').post((req, res) =>{
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token == null) return res.sendStatus(401).json({message : "lack permission"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        let username = user.username
        let message = req.body.message
       
        const tweet = {
            message : message,
            user : username,
        }

        //adds tweet to database for user associated with the autentication token
        User.updateOne({username:username},{$push: {tweets: tweet}},function(err,docs){
            if(!err){
                res.status(201).json('Tweet added')
            }else{
                console.log('Error in update /tweet :' + err);
                res.status(403).json('Error:' + err)
            }
        })
    })
 })

  
 //POST request to tweet with optional photos attached to it
 //expects message to be sent with tag "message"
 //expects all files to be sent from with tag "file"
 router.route('/tweet').post((req, res) =>{
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token == null) return res.sendStatus(401).json({message : "lack permission"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err){
            console.log(err);

            return res.sendStatus(401).json({message : "lack permission"})
        }else {
            let username = user.username
            let message = req.body.message
            let photos = []

            if(req.files){
                const file = req.files.file;
               
                // if true then mutiple file are being uploaded
                if(Array.isArray(file)){
                    _.forEach(_.keysIn(file), (key) => {
                        //TODO: add date to file to ensure 100% uniqueness, good for now tho
                          //create unique filename and add it to array that associated files to tweet
                          let fileExtension = file[key].name.split('.')[1]
                          let filename = shortid.generate().toString().concat('.' +fileExtension)
                          photos.push(filename)
                          
                          //add file to server uploads directory
                          file[key].mv('./uploads/'+username+ '/'+filename, function (err){
                              if(err){
                                  console.log(err);
                                 // return res.send(err);
                              }
                          }) 
                  })
                }else{
                     //handle one file upload
                    let fileExtension = file.name.split('.')[1]
                    let filename = shortid.generate().toString().concat('.' +fileExtension)
                    photos.push(filename)
                    file.mv('./uploads/'+username+ '/'+filename, function (err){
                        if(err){
                            console.log(err);
                           // return res.send(err);
                        }
                    }) 
                }

                //associates uploaded images to user that uploaded them
                User.updateOne({username:username},{$push: {uploadedPhotos:{$each : photos}}},function(err,docs){
                    if(!err){
                        console.log('sucessfully uploded ' + photos);
                    // res.sendStatus(200)
                    }else{
                        console.log('/tweet :pushing array ' + err);
                        res.sendStatus(403).json('Error:' + err)
                    }
                })
            }


            //create tweet object
            const tweet = {
                message : message,
                user : username,
                attachedPhotos : photos
            }    
    
            //adds tweet to database for user associated with the autentication token
            User.updateOne({username:username},{$push: {tweets: tweet}},function(err){
                if(!err){
                    console.log('successfully added tweet');
                    //res.status(201).json('Tweet added')
                }else{
                    console.log('Error in update /tweet :' + err);
                    return res.status(403).json('Error:' + err)
                }
            })
        }
    })//jwt verify

    res.status(200).json('Tweet Created')
})

 
router.route('/deletetweet').delete((req, res) =>{
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    //if no token is sent we end request and return error
    if(token == null) return res.sendStatus(401).json({message : "lack permission"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(!err){
            let username = user.username
            let toDelete = req.body.tweetid

            User.findOne({username:username},function(err,docs){
                if(!err){
                    //TODO delete found tweet
                    console.log(docs.tweets.id(toDelete));
                    //console.log('deleted tweet from doc:' + docs);
                    res.sendStatus(200)
                    //res.status(201).json('Tweet added')
                }else{
                    console.log('Error in update /tweet :' + err);
                    return res.status(403).json('Error:' + err)
                }
            })

        }else{ //handle error
            console.log('/deletetweet err in authenticaiton');
            res.sendStatus(403)
        }
    })

})



 module.exports = router;
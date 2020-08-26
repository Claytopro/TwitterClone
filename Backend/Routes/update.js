const jwt = require('jsonwebtoken'); // validating user 
const router = require('express').Router();
const shortid = require('shortid');
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require('imagemin-mozjpeg');

const _ = require('lodash');

require('dotenv').config();
let User = require('../Models/user.model');


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

                    res.sendStatus(200).json({message:"updated Avatar photo"})
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
    
    //if(token == null) res.sendStatus(401).json({message : "lack permission"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err){
            console.log(err);

            res.status(401).json({message : "lack permission"})
        }else { // no errors
            let username = user.username
            let isRetweet = req.body.isRetweet
            let message = req.body.message
            let photos = []

            //TODO: reduce this to a function
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
                          
                          //TODO: ensure image is jpg then remove png compressor package

                          //add file to server uploads directory
                          file[key].mv('./uploadsUncompressed/'+username+ '/'+filename, function (err){
                              if(err){
                                  console.log(err);
                                 res.json('Error uploading photos')
                              }else{
                                compressPhoto(username,filename)
                              }
                          }) 
                  })
                }else{
                     //handle one file upload
                    let fileExtension = file.name.split('.')[1]
                    let filename = shortid.generate().toString().concat('.' +fileExtension)
                    photos.push(filename)
                    file.mv('./uploadsUncompressed/'+username+ '/'+filename, function (err){
                        if(err){
                            console.log(err);
                            res.status(403).json('Error:' + err)
                        }else{
                            compressPhoto(username,filename)
                          }
                    }) 
                }

                //associates uploaded images to user that uploaded them
                User.updateOne({username:username},{$push: {uploadedPhotos:{$each : photos}}},function(err,docs){
                    if(err){
                        console.log('/tweet :pushing array ' + err);
                        res.status(403).json('Error:' + err)
                    }
                })
            }//handle files


            //create tweet object
            const tweet = {
                message : message,
                isRetweet : isRetweet,
                user : username,
                attachedPhotos : photos
            }    
    
            //adds tweet to database for user associated with the autentication token
            //in order to push new tweet to the front of the tweet array of the specified user:
            //must use $each in conjunction with $ position even when only adding 1 tweet to database
            User.updateOne({username:username},{$push:{tweets : {$each : [tweet], $position : 0 }}},function(err){
                if(!err){
                    console.log('successfully added tweet');
                    res.status(200).json({message :'successfully added tweet'})
                }else{
                    console.log('Error in update /tweet :' + err);
                    res.status(403).json('Error:' + err)
                }
            })//Adding tweet

        } //end of no errors
    })//jwt verify
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

/*
Route to change posible display information in user's schema
user the following parameters to update information in schema : 
"description" , "displayName" , "website" , "location"
*/
router.route('/profileinfo').post((req, res) =>{
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err){
            //console.log(err);
            res.status(401).json({message : "lack permission in route /displayname"})
        }else{
            let username = user.username
            let  updateQuery = {};
            
            //check if paramter name exists req 
            if(req.body.displayName){
                updateQuery.displayName = req.body.displayName
            }

            if(req.body.description){
                updateQuery.description = req.body.description
            }

            if(req.body.website){
                updateQuery.website = req.body.website
            }

            if(req.body.location){
                updateQuery.location = req.body.location
            }

            User.updateOne({username:username},updateQuery,function(err){
                if(err){
                    res.status(403).json('Error:' + err)
                }else{
                    res.status(200).json({message:"updated Display name photo"})
                }
            })
        }
    })//jwt verification
})

//route used for quickly refreshing searchbar with predictive username
router.route('/search').get((req, res) => {
    let toFind = req.body.username
    //TODO optimize this so it does not scan the whole document page
    // maybe look here:
    //https://stackoverflow.com/questions/10610131/checking-if-a-field-contains-a-string
    User.find( { username : {$regex : ".*"+toFind+".*"}}, 
        //TODO : handle error 
        function(err,docs){
            if(err){
                console.log(err);
            }else{
                if(docs.length > 0) {
                   //TODO RETURN 10 choices
                    res.status(200).json({username : docs[0].username,
                         displayName : docs[0].displayName})
                }else{
                    //create new user and send blank w/ username
                    res.status(200).json({username : "" , displayName : ""})
                }
            }
        })
})


//Route to add follower to specific user's following list 
//Adds the following user to the follower list of the followed user
//relies on user sending authentication token to ensure authorized follow
router.route('/follow').post((req, res) => {
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]
    const toFollow = req.body.follow
    if(!toFollow) return  res.status(401).json({message : "no input follow"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err){
            //console.log(err);
            res.status(401).json({message : "lack permission in route /follow"})
        }else{
            let username = user.username

            User.updateOne({username:toFollow},{$addToSet :{followers :username}},function(err,doc){
                if(err || doc.nModified === 0){
                    if(doc.nModified === 0) err = "User does not exist"
                    res.status(403).json('Error:' + err)
                }else{
                    User.updateOne({username:username},{$addToSet :{following :toFollow}},function(err){
                        if(err){
                            res.status(403).json('Error:' + err)
                        }else{
                            res.status(200).json({message:"updated follow list:" + toFollow})
                        }
                    })
                }
            })
            //The $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
            

            

        }
    })//authentication
})


router.route('/unfollow').post((req, res) => {
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]
    const toUnfollow = req.body.unfollow
    if(!toUnfollow) return  res.status(401).json({message : "no input follow"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err){
            //console.log(err);
            res.status(401).json({message : "lack permission in route /unfollow"})
        }else{
            let username = user.username

            //$pull with remove the specific element from the array, dont need to use &pullAll becasue we have ensure
            //names will be unique in the following array 
            User.updateOne({username:username},{$pull :{following :toUnfollow}},function(err){
                if(err){
                    res.status(403).json('Error:' + err)
                }else{
                    //after removed from following list do same for the user's followers list
                    User.updateOne({username:toUnfollow},{$pull :{followers :username}},function(err){
                        if(err){
                            res.status(403).json('Error:' + err)
                        }else{
                            res.status(200).json({message:"unfollowed: " + toUnfollow})
                        }
                    })
                }
            })
        }
    })//authentication
})





//Route to pull tweets from all that the user is following 
// to display as the "main feed" for the user
router.route('/feed').get((req, res) => {
    const authHeader = req.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if(err){
            //console.log(err);
            res.status(401).json({message : "lack permission in route /feed"})
        }else{ //authenticated successfully
            let username = user.username
            User.findOne({ username : username} , function(err,doc){
                if(err){
                    res.status(403).json({message : "User does not exsit"})
                }else{
                    let following = doc.following
                    

                    User.aggregate([
                        //get documents that usernames match following array
                        { $match    : { 'username' : { $in : following } } }, 
                        //expand array of tweets into stream of documents
                        { "$unwind": "$tweets" },
                        //sort documents based on createdAt 
                        { $sort: {'tweets.createdAt': -1 }},
                        //group all tweets backtogether
                        { "$group": {
                            _id : 0,
                            "combinedTweets": { "$push": "$tweets"}
                        }},
                    ]).exec(function (err, data) {
                        //return array of (JSON object)tweets aggregated for all user that are being followed 
                        res.status(200).json(data[0].combinedTweets)
                    })
                   
                }
            })//findOne
        }
    })//authentication

})


//Helper function for compressing images that are being uploaded
//current version does not allow for files to be sent to same folder, that is why there must be two
function compressPhoto(username,filename) {
    //console.log('compressing photos' + 'uploads/'+username +'/'+filename);

    (async () => {
        await imagemin(['uploadsUncompressed/'+username +'/'+filename], {
            destination: 'uploads/'+username,
            plugins: [
                imageminMozjpeg({quality: 50}),
                imageminPngquant({
                    quality: 50
                })
            ]
        }); 
    })();
}

 module.exports = router;
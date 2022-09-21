/*
Authentication class following singleton pattern to authenticate users 
and store state of the user
*/
import axios from '../node_modules/axios/dist/axios.js';

class Auth {

    constructor(){
        this.username = ''
        this.authenticated = false;
        this.token = null;
        this.refreshToken = null;
    }

    login(callback, username, password){
        
        //axios get requests do not 
        axios.post('http://localhost:5000/login',{
            "username" : username,
            "password" : password
            }).then((res) => {
                //succesfull authentication
                this.username = username;
                this.authenticated = true;
                this.refreshToken = res.data.refreshToken;
                this.token =  res.data.accessToken;
                //console.log('successfully loggedin, received token:' + this.refreshToken);
                callback(true);
                
            },(error) =>{
                if(error.response === undefined){
                   // console.log("error in auth no loggy in");
                }else{
                  //  console.log('error from get ' + error.response.data);
                }
                callback(false)       
        })
        
    }

    logout(callback){
        this.authenticated = false;
        callback()
    }

    isAuthenticated() {
        return this.authenticated
    }

    register(callback, username, password,email){

        axios.post('http://localhost:5000/login/register',{
            "username" : username,
            "email" : email,
            "password" : password
        }).then((res) => {
            //console.log('register work');
            callback(true);
            
        },(error) =>{
            if(error.response === undefined){
                //console.log("error in auth no register in");
            }else{
                //console.log('error from get ' + error.response.data);
            }
            callback(false)
            
        })
    }

   

    getUser(username,callback){
        axios.get('http://localhost:5000/' + username,{
        }).then((res) => {
            //console.log('got user' );
            //console.log('also user token +' + this.token);
            if(callback) callback(res.data);
            return(res.data);
        },(error) =>{

            if(!error.response) return null
            console.log("error in auth backend failed to send empty user." + error.response);
            
            if(callback) callback(error.response.data);
            return(error.response.data);
        })
    }

   
    //Call to retrieve aggregated tweets for all followed users
    getImages(username,img,callback){


        axios.get('http://localhost:5000/images/' + username +'/' + img,{ responseType: 'arraybuffer' },)
        .then((res) => {
           
            if(callback) callback(res.data);
            return(res.data);
        },(error) =>{
            //if image cant be found return null
            if(callback) callback(null);
            return(error.response.data);
        })
    }


    sendTweet(message , isRetweet,files,callback){
        //console.log(files);
        
        if(files.length ===0) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
            axios.post('http://localhost:5000/update/tweet',{
                "message" : message,
                'isRetweet' : isRetweet,
            },{
                headers: headers
            }).then((res) => {
               console.log(res);
               
               callback(200)
            },(error) =>{
                console.log(error);
                callback(401) 
            })   
        }else{
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + this.token
            }
            //create Form Data from function parameters
            let formData = new FormData();
            formData.append("message", message)
            formData.append('isRetweet',isRetweet)
            files.forEach(element => {
                formData.append("file", element);
                //console.log(element);
            });

            axios.post('http://localhost:5000/update/tweet',formData,{
                headers: headers
            }).then((res) => {
               console.log(res);
               callback(200)
                
            },(error) =>{
                console.log(error);
                callback(401)
            })   
        }
    }

    updateProfileInfo(description, displayName,website,location,callback){
        const data = {
            "description" : ((description.length >0) ? description : undefined),
            "displayName" : ((displayName.length >0) ? displayName : undefined),
            "website" : ((website.length >0) ? website : undefined),
            "location" : ((location.length >0) ? location : undefined),
        }
       
        //this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3QyIiwiaWF0IjoxNTk5MDgzNTAyLCJleHAiOjE1OTkwODcxMDJ9.eoC0b9sxPS5gaw-G-PzawwApkxwksL-9-b-ZHQPqW0M'

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        }

        axios.post('http://localhost:5000/update/profileinfo',
        data,
        {
            headers: headers
        }).then((res) => {
               console.log(res);
               callback(200)
                
            },(error) =>{
                console.log(error);
                callback(401)
                
            })   
    }


    addFollower(callback,userToFollow) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        }
        axios.post('http://localhost:5000/update/follow',{
           'follow' : userToFollow
        },{
            headers: headers
        }).then((res) => {
           console.log(res);
           
           callback()
        },(error) =>{
            console.log(error);
             
        })   
        
    }

    removeFollower(callback,userToUnfollow) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        }
        axios.post('http://localhost:5000/update/unfollow',{
           'unfollow' : userToUnfollow
        },{
            headers: headers
        }).then((res) => {
           console.log(res);
           
           callback()
        },(error) =>{
            console.log(error);
            
        })   
    }
    
    getMainfeed(callback){
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        }
        
        axios.get('http://localhost:5000/update/feed',{
            headers: headers
        }).then((res) => {
            console.log(res)
            callback(res)
         },(error) =>{
             console.log(error)
         })   
    }

    UpdateProfilePhoto(files, callback){
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + this.token
        }        
       
        let formData = new FormData();

        formData.append("file", files[0]);
          


        axios.post('http://localhost:5000/update/avatar',formData,{
            headers: headers
        }).then((res) => {
           console.log(res);
           callback(200)
            
        },(error) =>{
            console.log(error);
            callback(401)
        })  

    }


}

export default new Auth()
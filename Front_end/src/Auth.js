/*
Authentication class following singleton pattern to authenticate users 
and store state of the user
*/
import axios from '../node_modules/axios/dist/axios.js';

class Auth {

    constructor(){
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

   
    //Call to retrieve image from server return null if image does not exist
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

}

export default new Auth()
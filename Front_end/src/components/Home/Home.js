import React, { Component } from 'react';
import Auth from '../../Auth'
import './Home.css'
import { useHistory } from "react-router-dom";

import {Footer} from '../Footer/Footer.js'
import {Poster} from './specific_components/Poster/Poster'
import Signup from './specific_components/Signup/Signin'

class Home extends Component {


    login = (username,password,callback) => {   
        Auth.login((result) => {
            //if successfull login, push Valid user along to their profile
            if(result){
                this.props.history.push('/' + username)
            }
            //pass along result to signup function
            callback(result)
        } , username , password)
    }

    sendToRegister = () =>{
        let history = useHistory();
        history.push("/");
    }

    render() {
        return (
        <div className = "main" >
            <div className = "wrapper-div">
                <Poster/>
                <Signup loginFunction = {this.login} registerFunction = {this.sendToRegister}/>
            </div>    
            <Footer/>
        </div>
        );
    }
}

export default Home;

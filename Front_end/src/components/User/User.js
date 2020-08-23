import React from 'react';
import Profile from './specific_components/Profile/Profile'
import { useLocation } from 'react-router-dom'


function User () {
    let location = useLocation();
    let user = location.pathname.toString().substring(1);
    
    return(
        <Profile username = {user}></Profile>
    )
}



export default User;
   

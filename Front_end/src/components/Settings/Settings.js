import React, { Component } from 'react';
import Auth from '../../Auth'
import styles from './Settings.module.css'
import {Link} from 'react-router-dom'

//components
import LeftSideBar from '../User/specific_components/Functional/Left_sidebar/Leftsidebar'

//material ui
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import BackIcon from '@material-ui/icons/ArrowBack'

class Settings extends Component {
    _isMounted = false;

    constructor(props){
        super(props)
        
        this.state = {
            username: '',
            displayName : '',
            description : '',
            location : '',
            website : '',
            profileImg: '',
            coverPhoto : '',
            uploadedImgs: [],
            password : '',
            hasUpdated : false,
            hasError : false,
            isLoggedIn: false,
        }
    }

    componentDidMount(){
        this._isMounted = true;
        this.getLogin();
        this.getUserData();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    getUserData = () => {
        if(!this._isMounted) return
        //retreive user infomation from database
        let username = Auth.username
        let data; 
        Auth.getUser(username, (responce) =>{
            if(!this._isMounted) return
            data = responce;
            if(data === null) return
         
            this.setState({
                username : Auth.username,
                displayName : data.displayName,
                description: data.description,
                location : data.location,
                website : data.website,
                coverPhoto : data.coverPhotoPath,
                uploadedImgs : data.uploadedPhotos,
               
            })   
 
        })
    }

    //changes state
    handleChange = ({ target }) => {
        this.setState({
          [target.name]: target.value
        });
    }

    submitChanges = () => {
        if(!this._isMounted) return
        Auth.updateProfileInfo(
            this.state.description, 
            this.state.displayName,
            this.state.website,
            this.state.location,
            this.handleResponce,
            )
    }

    handleResponce = (responceCode) => {
        if(!this._isMounted) return
       
        if(responceCode === 200 || responceCode === true){
           this.showSuccess()
           this.getLogin()
        }else{
            this.showError()
        }
       
    }

    login = () => {
        if(!this._isMounted) return
        Auth.login(this.handleResponce, this.state.username,this.state.password)
        
    }

    getLogin = () => {
        
        if(!this._isMounted) return
        this.setState({
            isLoggedIn : Auth.authenticated,
        })

        if(Auth.authenticated){
            this.getUserData()
        }
    }

    showSuccess  = () => {
        if(!this._isMounted) return
        this.setState({
            hasUpdated : true,
        })
        setInterval(() => {
            if(!this._isMounted) return
            this.setState({
                hasUpdated : false,
            })
          },3000); 
    }

    showError = () => {
        if(!this._isMounted) return
        this.setState({
            hasError : true,
        })
        setInterval(() => {
            if(!this._isMounted) return
            this.setState({
                hasError : false,
            })
          },3000); 
    }


    render(){
        return(
            <div className = {styles.main}>
                <div className = {styles.content_container}>
                        <LeftSideBar/>
                        
                        {(this.state.isLoggedIn) && 
                        <div className = {styles.form_container}>
                            <Link to = {"/"+this.state.username} className = {styles.linkstyle} >
                                <BackIcon style={ {fontSize: 30, color : "rgb(29, 161, 242)", paddingRight : '10px'}} />
                            </Link>
                            <h3>Edit Info</h3>
                           
                            <TextField id = 'display-name' label = 'Display Name' placeholder = {this.state.displayName}  name = "displayName" onChange={ this.handleChange} />    
                            <TextField
                                id = 'description-field'
                                label='Description'
                                placeholder = {this.state.description}
                                multiline
                                rows={2}
                                rowsMax={6}
                                name = "description" onChange={ this.handleChange} 
                                />
                            <TextField id = 'website-name' label = 'Website' placeholder = {this.state.website} name = "website" onChange={ this.handleChange} />    
                            <TextField id = 'location-name' label = 'Location' placeholder = {this.state.location} name = "location" onChange={ this.handleChange} />    
                            <Button variant="outlined" style = {{color:'#1da1f2',borderColor:'rgb(29, 161, 242)',float : 'right',margin:'10px'}} onClick = {this.submitChanges}>Submit</Button>
                            {this.state.hasUpdated && <div className = {styles.notify}>Update successfull</div>}
                            {this.state.hasError && <div className = {styles.notify_error}>Error Updating</div>}

                        </div>}

                        {(!this.state.isLoggedIn) && 
                        <div className = {styles.form_container}>
                            <h3>Login</h3>
                            
                            <TextField id = 'username' label = 'Username'  name = "username" onChange={ this.handleChange} />    
                            <TextField id = 'password' label = 'Password'  name = "password" onChange={ this.handleChange} />    
                            <Button variant="outlined" style = {{color:'#1da1f2',borderColor:'rgb(29, 161, 242)',float : 'right',margin:'10px'}} onClick = {this.login}>Login</Button>
                            {this.state.hasError && <div className = {styles.notify_error}>Error Logining in</div>}

                        </div>}
                </div>
            </div>
        )
    }

}

export default Settings;
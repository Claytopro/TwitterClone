import React, { Component } from 'react';
import styles from './tinyAvatar.module.css'
import axios from 'axios';
import Auth from '../../../../../../Auth'
import {Link} from 'react-router-dom';

//material-ui
import Avatar from '@material-ui/core/Avatar'
import Popper from '@material-ui/core/Popper'

class tinyAvatar extends Component {

    constructor(props){
        super(props);
        this.avatarRef = React.createRef()
        
        this.state = {
            imgName : '',
            profileImg : '',
            username : props.username,
            displayname : '',
            showPopper: false,
        }
    }

    componentDidMount(){
        axios.post('http://localhost:5000/update/avatarpic',
        {
            "username" : this.state.username,
        })
        .then(res => {
           this.setState({
               displayname: res.data.displayName
           })
           this.getImage(this.state.username,res.data.profileImage)
        })
    }

    getImage(username, imgpath){
        Auth.getImages(username,imgpath, (response) =>{
            //convert image to base64 string
            const base64 = btoa(
                new Uint8Array(response).reduce(
                  (response, byte) => response + String.fromCharCode(byte),
                  '',
                ),
              );
              //setState for User Information retreived from database
           this.setState({
               profileImg : "data:;base64," + base64,
           });
           
        })
    }

    handleProfileDropDown = () => {
       
        this.setState({
            showPopper: true,
        });
    }

    handleRequestClose() {
        this.setState({
            showPopper: false,
        });
    };

    render(){
      
        return(
            <div className = {styles.container}>
                <Link to = {'/' + this.state.username} style = {{margin:'0px'}}>
                    <Avatar ref ={this.avatarRef} alt = "" src = {this.state.profileImg} 
                    style={{height: '70px',width : '70px', marginLeft:"10px",marginRight: '10px'}}
                    className = {styles.avatar}
                    onMouseEnter={() => this.setState({showPopper:true})}
                
                    onMouseLeave={() => this.setState({showPopper:false})}/>
                </Link>
                <Popper 
                    open={this.state.showPopper} 
                    anchorEl = {this.avatarRef.current} 
                >
                 <div className = {styles.Popper}>
                     hop
                 </div>
                </Popper>
                
            </div>
        )
    }
}


export default tinyAvatar;
   

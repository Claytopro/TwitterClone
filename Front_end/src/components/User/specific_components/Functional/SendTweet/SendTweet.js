import React, { Component } from 'react';
import styles from './SendTweet.module.css'
import Auth from '../../../../../Auth'

//Material-ui
import Button from '@material-ui/core/Button'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'


class SendTweet extends Component {
    constructor(props){
        super(props)
        this.state = {
            message: ''
          };

          this.handleChange = this.handleChange.bind(this);
          
    }

    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }

    postTweet = () =>{
        if(this.state.message.length < 1) return
        Auth.sendTweet(this.state.message , false)
    }


    render(){
        return(
            <div className = {styles.container}>
                <h3 style = {{marginLeft: '10px'}}>Whats Happening</h3>
                <textarea type = "text" className={styles.message} name = "message" onChange={ this.handleChange} required = "required"></textarea>
                <div className = {styles.send}>
                   <div className = {styles.addphoto}>
                        <AddAPhotoIcon style={ {fontSize: 30}} />
                   </div>
                    
                    <Button variant="outlined" style = {{color:'#1da1f2',borderColor:'rgb(29, 161, 242)',float : 'right',marginRight:'10px'}} onClick = {this.postTweet}>Tweet</Button>
                </div>
            </div>
        )
    }

}

export default SendTweet;
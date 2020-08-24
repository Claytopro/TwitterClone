import React, { Component } from 'react';
import Auth from '../../../../Auth'
import styles from './CoverPhoto.module.css'

class CoverPhoto extends Component {
        constructor(props){
            super(props);
            this.state = {
                coverPhoto:'',
                coverPhotoName: props.imageName,
                user : props.user,
                imgLoaded: false,
            }
        }

        componentDidMount()
        {
            this.pullPhoto(this.state.coverPhotoName,this.state.user)
        }

        //pull photo from user's directory on backend server
        pullPhoto = (imgName,user) => {
                Auth.getImages(user,imgName, (response) =>{
                    //check if returned object is not empty
                    // guaranteed not to be a Date() returned so no need to check for "obj.constructor === Object"
                    if(response !== null){
                        //convert image to base64 string
                        const base64 = btoa(
                            new Uint8Array(response).reduce(
                            (response, byte) => response + String.fromCharCode(byte),
                            '',
                            ),
                        );
    
                        if(base64 !== undefined){
                            this.setState({
                                coverPhoto: "data:;base64," + base64,
                                imgLoaded: true,
                            });
                        }
                    }     
                })
        }

        render(){
           return(
            <div className = {styles.coverphoto_container}>
               
                {this.state.imgLoaded && <img src = {this.state.coverPhoto} className = {styles.coverphoto} alt=""></img>}
               
            </div>
           )
        }
            
}

export default CoverPhoto;
import React, { Component } from 'react';
import Auth from '../../../Auth'

import styles from './AsynImages.module.css'

//material-ui
import CircularProgress from '@material-ui/core/CircularProgress' 

    class AsyncImage extends Component {
        constructor(props){
            super(props);
            this.state = {
                imagesToPull: Array.from(props.imgNames),
                images: [],
                user : props.user,
            }
        }

        componentDidMount(){
            
            this.state.imagesToPull.forEach((item,index) =>{
                this.pullPhoto(item,this.state.user)
            })

        }


        pullPhoto = (imgName,user) => {
                Auth.getImages(user,imgName, (response) =>{
                    //convert image to base64 string
                    const base64 = btoa(
                        new Uint8Array(response).reduce(
                        (response, byte) => response + String.fromCharCode(byte),
                        '',
                        ),
                    );
                    this.setState({
                        images: this.state.images.concat(["data:;base64," + base64])
                    });
                })
        }

        render(){
            let numberOfImages = this.state.images.length;
            let keys = this.state.imagesToPull;
            if(numberOfImages > 0){
                if(numberOfImages <= 2){
                    return(
                        <div className = {styles.OneImage_container}>
                           {this.state.images.map((img, i) => {    
                             return (
                                <img key = {keys[i]} src = {img} className = {styles.oneImage} alt=""></img>
                             ) 
                            })}
                        </div>
                    )
                }else if (numberOfImages <= 4){
                    // 3 or 4 images
                    return(
                        <div className = {styles.Image_container}>
                             {this.state.images.map((img, i) => {    
                             return (
                                <img key = {keys[i]} src = {img} className = {styles.oneImage} alt=""></img>
                             ) 
                            })}
                        </div>
                    )
                }else {
                    return(
                        <div className = {styles.Image_container}>
                             {this.state.images.map((img, i) => {    
                             return (
                                <img key = {keys[i]} src = {this.state.images[i]} className = {styles.oneImage} alt=""></img>
                             ) 
                            })}
                        </div>
                    )
                }
                    
                }else{
                    return(
                        <div className = {styles.loading}>
                           <CircularProgress/>
                        </div>
                    )
                }
        }
            
}

export default AsyncImage;
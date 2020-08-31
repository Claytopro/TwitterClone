import React, { Component } from 'react';
import Auth from '../../../../Auth'

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

        //pull photo from user's directory on backend server
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
                    let imgz = []
                    this.state.images.map((img, i) => { 
                        return(
                            imgz[i] =(
                                <div  className = {styles.ManyImage_div}>
                                    <img key = {keys[i]} src = {img} className = {styles.manyImage} alt=""></img>
                                </div>
                            )
                        )
                       })

                    return(
                        <div className = {styles.ManyImage_container}>
                            <div className = {styles.stackedImage_container}>
                                {imgz[0]}
                                {imgz[1]}
                            </div>
                            <div className = {styles.stackedImage_container}>
                                {imgz[2]}
                                {(imgz !== undefined) && imgz[3]}
                            </div>
                        </div>
                    )
                }else {
                    //TODO ADD when more than 5 images are part of tweet
                    return(
                        <div className = {styles.ManyImage_container}>
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
                            {(this.state.imagesToPull.length > 1)&&<CircularProgress/>}
                        </div>
                    )
                }
        }
            
}

export default AsyncImage;
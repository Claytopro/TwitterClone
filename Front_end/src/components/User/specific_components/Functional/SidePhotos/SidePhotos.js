import React, { Component } from 'react';
import styles from './SidePhotos.module.css';
import Auth from '../../../../../Auth'

//components

class SidePhotos extends Component {

    constructor(props){
        super(props);
        
        this.state = {
            imagesToPull: props.userImages,
            user : props.user,
            images : [],
        }

        
    }

    componentDidMount(){
      
        this.state.imagesToPull.forEach((item,index) =>{
            if(index < 6){
                this.pullPhoto(item,this.state.user)

            }
        })
        if(this.state.imagesToPull.length < 6){
         //add placeholder images 
        }
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
                if(base64.length !== 0){
                    this.setState({
                        images: this.state.images.concat(["data:;base64," + base64])
                    });
                }
            })
    }



    render(){
        let keys = this.state.imagesToPull;
        return(
            <div className = {styles.sidePhotos_container}>

               
                {this.state.images.map((img, i) => {  
                    if(i > 6) return false
                    return (
                        <div key = {keys[i]} className = {styles.ManyImage_div}>
                            <img key = {keys[i]} src = {img} className = {styles.manyImage} alt=""></img>
                        </div>
                    ) 
                })}
               

      
            </div>
        )
    }
}

export default SidePhotos;

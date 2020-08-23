import React, { Component } from 'react';
import Auth from '../../../../Auth'
import {Link} from 'react-router-dom';

import styles from './Profile.module.css'
//created components
import LeftSideBar from '../Functional/Left_sidebar/Leftsidebar'
import MediaSidebar from '../Functional/Media_sidebar/Mediasidebar'
import Tweets from '../Tweet/Tweets'

//material-ui components
import Chip from '@material-ui/core/Chip'
import BackIcon from '@material-ui/icons/ArrowBack'
import LocationIcon from '@material-ui/icons/LocationOnOutlined'
import LinkIcon from '@material-ui/icons/Link'
import CalendarIcon from '@material-ui/icons/DateRangeRounded'


class Profile extends Component {

    constructor(props){
        super(props)
       
        this.state = {
            username: props.username,
            description : '',
            replies : [],
            likes : [],
            profileImg: '',
            uploadedImgs: [],
            tweets: [],
            dateJoined : '',
        }
    }

    //Helper Function
    //converts date created from mongoDb to readable and displayable date
    ConvertDate = (dateCreate) => {
        if(!dateCreate) return
        let months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
        let toConvert = dateCreate.split('-');
        return months[parseInt(toConvert[1])] + ' ' + toConvert[0]  
    }

    componentDidMount(){
        //retreive user infomation from database
        let data; 
        Auth.getUser(this.state.username, (responce) =>{
            data = responce;
            //console.log('data in PROFILE IS:' +  JSON.stringify(data));
            //chain callback to ensure asyn database calls complete before updating state
            Auth.getImages(this.state.username,data.profilePhotoPath, (response) =>{
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

           let createdDate = this.ConvertDate(data.createdAt);

            this.setState({
                description: data.description,
                replies: data.replies,
                likes : data.likes,
                uploadedImgs : data.uploadedPhotos,
                tweets: data.tweets,
                dateJoined : createdDate
            })
        })
    }

    
    follow = () =>{
        console.log("follow");
    }



    render(){
        return(
            <div className = {styles.main_container}>
                <div className = {styles.content_container}>
                    <LeftSideBar/>

                    {/*Beginning of User information div*/}
                    <div className = {styles.user_view}>
                        {/*TODO REDUE TO FUNCTIONAL COMPONET */}
                        <div className = {styles.head}>
                             <Link to = "/home" className = {styles.linkstyle} >
                                <BackIcon style={ {fontSize: 30, color : "rgb(29, 161, 242)", paddingRight : '10px'}} />
                            </Link>
                            <div className = {styles.head_title}>
                                <h3 style={{marginBottom: '2px',marginTop : '0px'}}>{this.state.username}</h3>
                                <span  style={{color : "gray"}}>{this.state.tweets.length} Tweets</span>
                            </div>   
                        </div>

                        <div className = {styles.info}>
                            <div className = {styles.info_coverphoto}>

                            </div>

                            <div className = {styles.info_profilephoto}>
                                <div className = {styles.profileImg_container}>
                                    <img src = {this.state.profileImg} className = {styles.profileImage} alt=""></img>
                                    <div className = {styles.followbtn}>
                                        <Chip
                                            variant="outlined" 
                                            label = "Follow"
                                            style={{height: '35px',width: '70px',color: 'rgb(29, 161, 242)',borderColor:'rgb(29, 161, 242)', fontWeight:'bolder'}}
                                            onClick = {this.follow}
                                        />
                                    </div>
                                </div>
                                <h3 style={{marginBottom: '0px',marginTop : '0px'}}>{this.state.username}</h3>
                                <span style={{color: 'gray'}}>@{this.state.username}</span>
                            </div>
                          
                           <div className = {styles.info_content}>
                               <div className = {styles.info_text}>
                                    description:
                                    {this.state.description}
                               </div>
                               
                                <div className = {styles.info_links}>
                                    <span className = {styles.linkalign}>
                                       <LocationIcon style={{paddingRight: '3px'}}/>
                                       <p>Los angles</p>
                                    </span> 
                                   
                                   <span className = {styles.linkalign}>
                                        <LinkIcon style={{paddingRight: '3px'}}/> 
                                        <p>link.com</p>
                                    </span> 

                                   <span className = {styles.linkalign}>
                                       <CalendarIcon style={{paddingRight: '3px'}}/> 
                                       <p>{this.state.dateJoined} </p>
                                    </span> 
                                </div>

                                <div className = {styles.info_text}>
                                    pLACEHOLDER Following : , Followers : 
                                </div>
                           </div>
                        </div>

                        <div>
                            {this.state.tweets.map(tweet => (
                                <Tweets key={tweet._id} tweet = {tweet} avatarImg = {this.state.profileImg}/>
                            ))}
                        </div>
                        
                    </div>
                    {/*end of user info div */}
                    <MediaSidebar/>
                </div>
            </div>
        )
    }
}


export default Profile;
import React, { Component } from 'react';
import Auth from '../../../../Auth'
import {Link} from 'react-router-dom';

import styles from './Profile.module.css'
//created components
import LeftSideBar from '../Functional/Left_sidebar/Leftsidebar'
import MediaSidebar from '../Functional/Media_sidebar/Mediasidebar'
import Tweets from '../Tweet/Tweets'
import CoverPhoto from '../CoverPhoto/CoverPhoto'
import FollowTab from '../Functional/FollowTab/FollowTab'
import SendTweet from '../Functional/SendTweet/SendTweet'


//material-ui components
import Chip from '@material-ui/core/Chip'
import BackIcon from '@material-ui/icons/ArrowBack'
import LocationIcon from '@material-ui/icons/LocationOnOutlined'
import LinkIcon from '@material-ui/icons/Link'
import CalendarIcon from '@material-ui/icons/DateRangeRounded'
import Backdrop from '@material-ui/core/Backdrop'


class Profile extends Component {

    constructor(props){
        super(props)
       
        this.state = {
            username: props.username,
            displayName : '',
            description : '',
            location : '',
            website : '',
            replies : [],
            likes : [],
            following : null,
            followers : null,
            profileImg: '',
            coverPhoto : '',
            uploadedImgs: [],
            tweets: [],
            dateJoined : '',
            hasLoaded : false,
            openBackdrop : false,
            isAuthenticated : false,
            isFollowing : false,
        }
    }

    //Helper Function
    //converts date created from mongoDb to readable and displayable date
    ConvertDate = (dateCreate) => {
        if(!dateCreate) return
        let months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
        let toConvert = dateCreate.split('-');
        return months[parseInt(toConvert[1])-1] + ' ' + toConvert[0]  
    }

    componentDidMount(){
        //retreive user infomation from database
        let data; 
        Auth.getUser(this.state.username, (responce) =>{
            data = responce;
            if(data === null) return
            let createdDate = this.ConvertDate(data.createdAt);
           
            this.setState({
                displayName : data.displayName,
                description: data.description,
                location : data.location,
                website : data.website,
                replies: data.replies,
                likes : data.likes,
                following : data.following,
                followers : data.followers,
                coverPhoto : data.coverPhotoPath,
                uploadedImgs : data.uploadedPhotos,
                tweets: data.tweets,
                dateJoined : createdDate,
                hasLoaded : true,
            }, () => {this.isFollowing()})
          
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
        })
    }

    

    isFollowing = () => {
        if(this.state.followers === undefined) return

        if(this.state.followers.includes(Auth.username)){
            this.setState({
                isFollowing:true,
            })
        }else{
            this.setState({
                isFollowing:false,
            })
        }
    }

    follow = () =>{
        if(this.state.isFollowing){
            console.log("UNfollow");
            Auth.removeFollower(()=>{this.didUnfollowed(Auth.username)},this.state.username )
        }else{
            console.log("follow");
            Auth.addFollower(()=>{this.didFollow(Auth.username)},this.state.username )
        }
    }

    didFollow = (user) =>{
        this.setState({isFollowing:true,
        followers:this.state.followers.concat([user])})
    }

    didUnfollowed = (user) =>{
        //find user and removed from array of followers
        let array = this.state.followers;
        let index = array.indexOf(user)
        array.splice(index, 1);

        this.setState({
            isFollowing:false,
            followers:array,
        })
    }

    didTweet = () =>{
        //pull tweets from database again?
        Auth.getUser(this.state.username, (responce) =>{
            if(responce === null) return
            this.setState({
                tweets: responce.tweets,
            })
        })

    }

    openBackdrop = () => {
        this.setState({openBackdrop:true})
    }

    closeBackdrop = () => {
        this.setState({openBackdrop:false})
    }


    render(){
        return(
            <div className = {styles.main_container}>
                <div className = {styles.content_container}>
                    <Backdrop style = {{zIndex: 999}} open={this.state.openBackdrop} onClick= {this.closeBackdrop}>
                        <img src = {this.state.profileImg} className = {styles.profileImage_backdrop} alt=""></img>
                    </Backdrop>

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
                        {/*Cover Photo, ensure only loads when coverphoto is set*/}
                        {this.state.hasLoaded && <CoverPhoto imageName = {this.state.coverPhoto} user = {this.state.username}/>}
                        {/*TODO REFACTOR THIS INTO ITS OWN COMPONENT */}
                            <div className = {styles.info_profilephoto}>
                                <div className = {styles.profileImg_container}>
                                    <img src = {this.state.profileImg} className = {styles.profileImage} alt="" onClick={this.openBackdrop}></img>
                                    {!(this.state.username === Auth.username) &&
                                    <div className = {styles.followbtn}>
                                        {/*Follow Button */}
                                        <Chip
                                            variant="outlined" 
                                            label = {this.state.isFollowing? 'UnFollow' : 'Follow'}
                                            style={{height: '35px',width: '80px',color: 'rgb(29, 161, 242)',borderColor:'rgb(29, 161, 242)', fontWeight:'bolder'}}
                                            onClick = {this.follow}
                                        />
                                    </div>
                                    }
                                </div>
                                {/*display under avatar*/}
                                <h3 style={{marginBottom: '0px',marginTop : '0px',paddingLeft:'4px'}}>{this.state.displayName}</h3>
                                <span style={{color: 'gray',paddingLeft:'4px'}}>@{this.state.username}</span>
                            </div>
                          
                           <div className = {styles.info_content}>
                               <div className = {styles.info_text}>
                                    {this.state.description}
                               </div>
                               
                                <div className = {styles.info_links}>
                                    <span className = {styles.linkalign}>
                                       <LocationIcon style={{paddingRight: '3px'}}/>
                                    <p>{this.state.location}</p>
                                    </span> 
                                   
                                   {/*TODO: send to external site*/}
                                   <span className = {styles.linkalign}>
                                        <LinkIcon style={{paddingRight: '3px'}}/> 
                                        <a target="" href={'www.' + this.state.website} style = {{color:"black",textDecoration: 'none'}}>{this.state.website}</a>
                                    </span> 

                                   <span className = {styles.linkalign}>
                                       <CalendarIcon style={{paddingRight: '3px'}}/> 
                                       <p>{this.state.dateJoined} </p>
                                    </span> 
                                </div>
                                {/*Ensure follower arrays are loaded before sending info to component */}
                                {(this.state.followers) &&<FollowTab key={this.state.followers} followers = {this.state.followers} following = {this.state.following} />}
                           </div>
                        </div>

                        {(Auth.username === this.state.username) && <SendTweet didTweet = {this.didTweet}/>}
                        


                        {this.state.tweets.map(tweet => (
                            <Tweets key={tweet._id} tweet = {tweet}/>
                        ))}
                        
                        
                        
                    </div>{/*end of user info div */}
                    
                    <MediaSidebar user = {this.state.username} userImages = {this.state.uploadedImgs}/>
                </div>
                
                
            </div>
        )
    }
}


export default Profile;
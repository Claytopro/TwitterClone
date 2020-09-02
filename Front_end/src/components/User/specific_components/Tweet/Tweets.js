import React from 'react';
//styles
import styles from './Tweet.module.css'

//components
import {Link} from 'react-router-dom';
import AsyncImage from '../AsyncImage/AsyncImage'

//import from material-ui
import Avatar from '@material-ui/core/Avatar'
import CommentBubble from '@material-ui/icons/ChatBubbleOutlineOutlined'
import Heart from '@material-ui/icons/FavoriteBorderOutlined'
import Retweet from '../../../Universal/RetweetIcon/Retweet'

 function Tweets (props) {
        let info = props.tweet;
        let displayName = props.displayName

        return(
            <div className = {styles.tweet_container}>
                <div className = {styles.avatar_container}>
                    <Link to = {'/' + info.user}>
                    <Avatar alt = "" src = {props.avatarImg} style={{height: '70px',width : '70px', margin:"10px"}}/>
                    </Link>
                </div>

                <div className = {styles.info_container}>
                    <div className = {styles.header_container}>
                        <Link to = {'/' + info.user} className = {styles.links}>{displayName}</Link>
                        <span style={{color: 'gray',paddingLeft:"5px"}}>@{info.user} · {toDate(info.createdAt)} </span>
                    </div>
                    <p className = {styles.description}>
                    {info.message}
                    </p>

                    <AsyncImage imgNames = {info.attachedPhotos} user={info.user}/>

                    {/*Footer with Image if attached*/}
                    <div className = {styles.footer_container}>
                        <span className = {styles.linkalign}>
                            <CommentBubble style={{paddingRight: '8px',height:"17px",width: "17px"}}/> 
                            <p style = {{margin:"0px"}}>{info.replies.length}</p>
                        </span> 

                        <span className = {styles.linkalign}>
                            <Heart style={{paddingRight: '8px',height:"17px",width: "17px"}}/> 
                            <p style = {{margin:"0px"}}>likes</p>
                        </span> 

                        <span className = {styles.linkalign}>
                            <Retweet style={{paddingRight: '8px',height:"17px",width: "17px"}}/> 
                            <p style = {{margin:"0px"}}>Retweet</p>
                        </span> 

                    </div>
                </div>

            </div>
        )
}


function toDate(dateCreate){
    let months = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];
    let toConvert = dateCreate.split('-');
    return months[parseInt(toConvert[1])-1] + ' ' + toConvert[0]  
}


export default Tweets;
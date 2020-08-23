import React from 'react';
import styles from './Poster.module.css'
import TwitterIcon from '../../../Universal/TwitterIcon/TwitterIcon'

//Material-ui 
import SearchIcon from '@material-ui/icons/Search'
import PeopleIcon from '@material-ui/icons/PeopleOutline'
import CommentBubbleIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'


export const  Poster = () => {
    return (
        <div className = {styles.side} >
            <div className = {styles.listdiv}>
                <ul className = {styles.poster_list}>
                    <li className = {styles.poster_item}><SearchIcon style = {{paddingRight: "5px"}}/>Follow ur Interrests</li>
                    <li className = {styles.poster_item}><PeopleIcon style = {{paddingRight: "5px"}}/>Hear what people are talking about</li>
                    <li className =  {styles.poster_item}><CommentBubbleIcon style = {{paddingRight: "5px"}}/>Join the conversation</li>
                </ul>
            </div>
                <TwitterIcon style={ {fontSize: 1000 , color : "rgb(29, 161, 242)", marginLeft : "10%",marginBottom:"20%"}} />
        </div>        
    )
}
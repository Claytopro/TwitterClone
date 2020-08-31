import React, { Component } from 'react';
import styles from './FollowTab.module.css'

import TinyAvatar from './tinyAvatar/tinyAvatar'

class FollowTab extends Component {

    constructor(props){
        super(props);
        this.state = {
            followers: props.followers,
            following : props.following,
            showFollowers : false,
            showFollowing : false,
        }
    }

  
    render() {
        return (
            <div className = {styles.main_container}>
                <div >
                    <span className = {styles.info_text} onClick = {() => {this.setState({showFollowers :!this.state.showFollowers, showFollowing : false})}}>{this.state.followers.length} Followers</span>
                    <span className = {styles.info_text} onClick = {() => {this.setState({showFollowing :!this.state.showFollowing,showFollowers: false})}}>{this.state.following.length} Following</span>
                </div>
                
                {this.state.showFollowers && (
                    <div className = {styles.follow_container}>
                         {this.state.followers.map((user, i) => {    
                             return (
                                <div key = {user}> 
                                    <TinyAvatar username = {user}/>
                                   {user}
                                </div>
                                ) 
                            })}
                    </div>
                )}

                {this.state.showFollowing && (
                    <div className = {styles.follow_container}>
                    {this.state.following.map((user, i) => {    
                        return (
                            <div key = {user}> 
                                <TinyAvatar username = {user}/>
                                {user}
                            </div>
                         ) 
                        })}
                    </div>
                )}
            </div>
        );
    }
 
}


export default FollowTab;
   

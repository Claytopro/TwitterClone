import React, { Component } from 'react';
import Auth from '../../Auth'
import styles from './MainFeed.module.css'

//components
import Leftsidebar from '../User/specific_components/Functional/Left_sidebar/Leftsidebar'
import SeachBar from '../User/specific_components/Functional/SearchBar/Searchbar'
import Tweets from '../User/specific_components/Tweet/Tweets'

class MainFeed extends Component {

    constructor(props){
        super(props)

        this.state = {
            tweets : [],

        }
    }

    componentDidMount(){
        Auth.getMainfeed( (responce) =>{
            console.log(responce.data);
            if(responce.data === null) return
            this.setState({tweets : responce.data})
        })
    }

    render(){
        return(
            <div className = {styles.main}>
                <div className = {styles.content_container}>
                    <Leftsidebar/>
                    <div className = {styles.mainfeed}>
                        <SeachBar/>
                        <h2>News Feed</h2>
                        {(this.state.tweets.length === 0) && <p>No Tweets</p>}
                        {this.state.tweets.map(tweet => (
                            <Tweets key={tweet._id} tweet = {tweet}/>
                        ))}
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default MainFeed;
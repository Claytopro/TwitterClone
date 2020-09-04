import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styles from './sidebar.module.css'

import HashtagIcon from '../../../../Universal/HashTagIcon/HashTagIcon'
import TwitterIcon from '../../../../Universal/TwitterIcon/TwitterIcon'
import SettingsIcon from '@material-ui/icons/Settings'

class LeftSideBar extends Component {

    constructor(props) {
        super(props)
        this.state = { matches: window.matchMedia("(min-width: 1000px)").matches };
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 1000px)").addListener(handler);
      }

    render(){
        return(    
                <div className = {styles.container}>
                    <Link to = "/home" className = {styles.linkstyle}>
                        <TwitterIcon style={ {fontSize: 50 , color : "rgb(29, 161, 242)"}} />
                    </Link>
    
                    <Link to = "/explore" className = {styles.linkstyle}>
                        <HashtagIcon style = {{fontSize: 30,paddingRight:"10px"}} />
                        {this.state.matches && ("Explore")}
                        {!this.state.matches && ("")} 
                    </Link>
                  
                    <Link to = "/settings" className = {styles.linkstyle} >
                        <SettingsIcon style = {{fontSize: 30 ,paddingRight:"10px"}}/> 
                        {this.state.matches && ("Settings")}
                        {!this.state.matches && ("")} 
                    </Link>
                   
                </div>
        )
    }
}


export default LeftSideBar;
   

import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios'

import styles from './searchbar.module.css'
import TinyAvatar from '../../Functional/FollowTab/tinyAvatar/tinyAvatar'

//material-ui
import SearchIcon from '@material-ui/icons/SearchRounded'

class SearchBar extends Component {

    constructor(props){
        super(props);

        this.state = {
            searchbar: '',
            users: [],
            userImgs: [],
            showSuggest: false,
        }
    }

    handleChange = ({ target }) => {
        this.setState({
          [target.name]: target.value
        },function (){
            this.findUsers(this.state.searchbar)
        })
    }

    findUsers = (toFind) => {
        if(toFind.length === 0) {
            this.setState({users: []})    
            return //prevent searching when search is empty
        }

        axios.post('http://localhost:5000/update/search',
        {
            "username" : toFind,
        })
        .then(res => {
            this.setState({users: res.data})
            //console.log(JSON.stringify(res.data));
           
        })
    }

    render(){
        return(
            <div className = {styles.container}>
               <div className = {styles.searchbar}>
                
                   <SearchIcon style = {{color:'#748592',width: '30px',height:'30px',marginLeft:'-15px'}}/>
               
                    <input type = "text" className ={styles.searchbar_input} name = "searchbar" onChange = {this.handleChange} placeholder="Search" 
                    onFocus = {() => {this.setState({showSuggest:true})}}
                    onBlur = {() => {this.setState({showSuggest:false})}}/>
                  
               </div>

                {true && 
                <div className = {styles.suggested}> 
                        {(this.state.searchbar.length === 0) && 
                        <p style = {{marginTop:'0px'}}>Try searching for people, topics, or keywords</p>
                        }
                       {(this.state.users.length > 0) && this.state.users.map((user, i) => {  
                            if(i>10) return   
                            return (
                                <div key = {user.username} className = {styles.userList} styles = {{height:'100px'}}>
                                    <TinyAvatar username = {user.username}/>
                                    <div className = {styles.userList_names}>
                                    <span style = {{fontWeight: "bolder",overflow:'hidden'}}>{user.displayName} </span>  
                                    <Link to = {'/' + user.username} onClick= {()=>{return true}} className = {styles.link}>@{user.username} </Link> 
                                    </div>
                                </div>
                                )
                            })}
            
                </div>}

            </div>
   
        )
    }
}

export default SearchBar;
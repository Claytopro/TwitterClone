import React, { Component } from 'react';
import styles from './mediasidebar.module.css'

//components
import SearchBar from '../SearchBar/Searchbar'

class Mediasidebar extends Component {

    constructor(props){
        super(props);
        this.state = {
            userImgs: [],
        }
    }
  
    render(){

        return(    
            <div className = {styles.mediasidebar_container}> 
               <SearchBar/>           
            </div>
        )
    }
   
}


export default Mediasidebar;
   

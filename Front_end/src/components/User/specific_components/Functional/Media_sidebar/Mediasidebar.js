import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styles from './mediasidebar.module.css'

//react-select components
import AsyncSelect from 'react-select/async';

class Mediasidebar extends Component {

    constructor(props){
        super(props);

        this.state = {
            seachbar: '',
            userImgs: [],
        }
    }

    handleChange = ({ target }) => {
        this.setState({
          [target.name]: target.value
        });
    }

    findUsers = () => {
        //call databse query
    }

    loadOptions = (inputValue, callback) => {
        this.findUsers(inputValue)    
    };

  
    render(){

        return(    
            <div className = {styles.mediasidebar_container}> 
                <div>
                    seach bar
                       
                </div>              
            </div>
        )
    }
   
}


export default Mediasidebar;
   

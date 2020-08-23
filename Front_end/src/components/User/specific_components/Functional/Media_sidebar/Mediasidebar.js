import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styles from './mediasidebar.module.css'

class Mediasidebar extends Component {

    constructor(props){
        super(props);

        this.state = {
            seachbar: null,
            userImgs: [],
        }
    }

    handleChange = ({ target }) => {
        this.setState({
          [target.name]: target.value
        });
    }

    render(){
        return(    
            <div>
                <input type = "text" name = "seachbar" onChange={ this.handleChange } ></input>

               Media sidebar
            </div>
        )
    }
   
}


export default Mediasidebar;
   

import React, { Component } from 'react';
import styles from './Signup.module.css'
import {Link} from 'react-router-dom';


class Signin extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: null,
            password: null,
            failLogin:false,
          };

          this.handleChange = this.handleChange.bind(this);
          this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }

    handleLogin(e){
        e.preventDefault()
        this.props.loginFunction(this.state.username, this.state.password, 
            (didLogin) => {
                
                this.setState({failLogin:!didLogin});
               if(didLogin){
                //show loading swirle?
               }
            })
    }

    render(){
        return(
            <div className = {styles.wrapper}> 
    
                <form className = {styles.formstyle}> 
                    <div className = {styles.input_field}>
                        {this.state.failLogin ? (<h4>Incorrect username or pass</h4>) : ( <h4>username</h4>) }
                       
                        <input type = "text" className={styles.input_signup} name = "username" onChange={ this.handleChange } ></input>
                    </div>
                    <div className = {styles.input_field}>
                        <h4>password</h4>
                        <input type = "password" className={styles.input_signup} name = "password" onChange={ this.handleChange } ></input>
    
                    </div>
                    <div className = {styles.input_field}>
                       
                        <button onClick = {this.handleLogin} 
                        className = {styles.loginbutton}>Login</button> 
    
                    </div>
                </form>
            
                <div className = {styles.centeritem}>
                    <h2>See what's happening in the world right now</h2>
    
                     <div >
                         <Link to = "/register">Sign up</Link>
                    </div>   
    
                </div>
        </div>    
        );
    }
}

export default Signin;
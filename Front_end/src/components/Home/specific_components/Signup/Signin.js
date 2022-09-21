import React, { Component } from 'react';
import styles from './Signup.module.css'
import {Link} from 'react-router-dom';

//Material-ui components
import Chip from '@material-ui/core/Chip'

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
                
                {/*Form used to parse login information */}
                <form className = {styles.formstyle}> 
                    <div className = {styles.input_field}>
                        {/*Username input */}
                        <h4 style = {{marginTop:'0px'}}>{this.state.failLogin ? 'Incorrect username or pass' : 'Username'}</h4>
                        <input type = "text" className={styles.input_signup} name = "username" onChange={ this.handleChange } ></input>
                    </div>
                    <div className = {styles.input_field}>
                         {/*Password input */}
                        <h4 style = {{marginTop:'0px'}}>password</h4>
                        <input type = "password" className={styles.input_signup} name = "password" onChange={ this.handleChange } ></input>
    
                    </div>
                    <div className = {styles.input_field}>
                        <Chip
                            variant="outlined" 
                            label =  'Login'
                            style={{height: '35px',width: '80px',color: 'rgb(29, 161, 242)',borderColor:'rgb(29, 161, 242)', fontWeight:'bolder'}}
                            onClick = {this.handleLogin} 
                        />
                       
                    </div>
                </form>
            
                <div className = {styles.centeritem}>
                    <h2>See what's happening in the world right now</h2>
                        <Link to = "/register" style = {{width : '80%'}}>
                            <Chip
                            variant="outlined" 
                            label =  'Sign Up'
                            style={{height: '35px',width: '100%',color: 'rgb(29, 161, 242)',borderColor:'rgb(29, 161, 242)', fontWeight:'bolder'}} 
                            />
                        </Link>
                </div>
        </div>    
        );
    }
}

export default Signin;
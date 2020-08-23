import React, { Component } from 'react';
import Auth from '../../Auth'
import styles from './Register.module.css'

class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: null,
            password: null,
            confirmedPass: null,
            email:null,
            errors: {},
            didCreateUser:false,
          };

          this.handleChange = this.handleChange.bind(this);
          this.handleRegister = this.handleRegister.bind(this);
    }

    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }

    handleFormValidation = () =>{
        let validForm = true;
        let errors = {};
        
        //check if username is not empty
        if(!this.state.username){
            validForm = false;
            errors["username"] = "Cannot be empty";
        }

        //check if email field is not empty
        if(!this.state.email){
            validForm = false;
            errors["email"] = "Cannot be empty";
         }
 
         if(this.state.email !== null){
            let lastAtPos = this.state.email.lastIndexOf('@');
            let lastDotPos = this.state.email.lastIndexOf('.');
 
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.email.indexOf('@@') === -1 && lastDotPos > 2 && (this.state.email.length - lastDotPos) > 2)) {
                validForm = false;
                errors["email"] = "Email is not valid";
             }
        }  


        //check if password is not empty
        if(!this.state.password){
            validForm = false;
            errors["password"] = "Cannot be empty";
        }

         //check if confirmed password is not empty
         if(!this.state.confirmedPass){
            validForm = false;
            errors["confirmedPass"] = "Cannot be empty";
        }

        // check if both password fields match
        if(this.state.password !== this.state.confirmedPass){
            validForm = false;
            errors["confirmedPass"] = "Passwords must match password";
        }

        this.setState({errors : errors})

        return validForm

    }


    handleRegister(e){
      
        e.preventDefault()
        let validForm = this.handleFormValidation();

        if(validForm){
            Auth.register((result) => {
                console.log('reg results =' + result);
                //if registration is successful return to home page
                    if(result){
                        this.props.history.push('/home')
                    }
            } , this.state.username, this.state.password,this.state.email)
        }

    }


    render(){
        return(
            <div className = {styles.main}>
                    <form>
                        <h1>Create your account</h1>
                        <div className = {styles.input_container}>
                            <h3 className = {styles.h3_input}>Email:</h3>
                            <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                            <input type = "text" className={styles.input_register} name = "email" onChange={ this.handleChange} required = "required"></input>
                        </div>

                        <div className = {styles.input_container}>
                            <h3 className = {styles.h3_input}>Username:</h3>
                            <span style={{color: "red"}}>{this.state.errors["username"]}</span>
                            <input type = "text" className={styles.input_register} name = "username" onChange={ this.handleChange }></input>
                        </div>

                        <div className = {styles.input_container}>
                            <h3 className = {styles.h3_input}>Password:</h3>
                            <span style={{color: "red"}}>{this.state.errors["password"]}</span>
                            <input type = "text" className={styles.input_register} name = "password" onChange={ this.handleChange }></input>
                        </div>

                        <div className = {styles.input_container}>
                            <h3 className = {styles.h3_input}>Confirm Password:</h3>
                            <span style={{color: "red"}}>{this.state.errors["confirmedPass"]}</span>
                            <input type = "text" className={styles.input_register} name = "confirmedPass" onChange={ this.handleChange }></input>
                        </div>
                        <div className = {styles.button_div}>
                            <button className = {styles.nice_button} onClick = {this.handleRegister}>Create Account</button>
                        </div>
                    </form>
                
            </div>
        )
    }
}

export default Register;

import React, { Component } from 'react';
import styles from './SendTweet.module.css'
import Auth from '../../../../../Auth'

//Material-ui
import Button from '@material-ui/core/Button'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'

class SendTweet extends Component {
    constructor(props){
        super(props)
        this.didTweet = props.didTweet;

        this.state = {
            message: '',
            files : [],
            previews : [],
            successfullTweet : false,
            errorTweet : false,
          };

          this.handleChange = this.handleChange.bind(this);
          
    }

    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
    }

    onFileChange = event => { 
  
        let uploads=Array.from(event.target.files);
        let uploadsImgs = []
        //create image reference for each file uploaded that will be displayed to user
        uploads.forEach((file,i) => {
            uploadsImgs[i] = URL.createObjectURL(event.target.files[i])
        });
        
        // Update the state 
        this.setState({ 
            files: uploads,
            previews : uploadsImgs
        }) 
    
      }; 

    clearForm = (successCode) => {
        //tweet was successfull
        if(successCode === 200) {
            this.showSuccess()
            let tweetMessage = this.refs.tweetarea;
            tweetMessage.value = ''
            this.setState({
                files : [],
                previews : [],
                message : '',
            })

        }else{
            this.showError()
        }
       
    }
//TODO protect from memory leak if state updates after user naviagtes before 3 second timer
    showSuccess  = () => {
        this.didTweet();
        this.setState({
            successfullTweet : true,
        })
        setInterval(() => {
            this.setState({
                successfullTweet : false,
            })
          },3000); 
    }

    showError  = () => {
        this.setState({
            errorTweet : true,
        })

        setInterval(() => {
            this.setState({
                errorTweet : false,
            })
          },3000); 
    }
    

    postTweet = () =>{
        if(this.state.message.length < 1){
            
            alert('Tweet cannot be empty')
            return 
        } 
        Auth.sendTweet(this.state.message , false,this.state.files,this.clearForm)
    }

  
    render(){
        return(
            <div className = {styles.container}>
                <h3 style = {{marginLeft: '10px'}}>Whats Happening</h3>

                {this.state.successfullTweet && <div className = {styles.successfullTweet}>Tweet Sent </div>}
                {this.state.errorTweet && <div className = {styles.errorTweet}>Error Sending Tweet</div>}

                <textarea ref ='tweetarea' type = "text" className={styles.message} name = "message" onChange={ this.handleChange} ></textarea>
                    
                <div className = {styles.uploadArea}>
                    {this.state.previews.map((file, i) => {    
                        return (
                            <img key = {i} src = {file} alt = "" className = {styles.tinyPhoto}/>
                        ) 
                    })}
                </div>

                <div className = {styles.send}> 
                    <Button
                    className = {styles.addphoto}
                    component="label"
                    >
                    <AddAPhotoIcon style = {{fontSize: '35px'}}/>
                        <input
                            type="file"
                            multiple="multiple"
                            style={{ display: "none" }}
                            onChange={this.onFileChange}
                        />
                    </Button>
                    <Button variant="outlined" style = {{color:'#1da1f2',borderColor:'rgb(29, 161, 242)',float : 'right',marginRight:'10px'}} onClick = {this.postTweet}>Tweet</Button>
                </div>
            </div>
        )
    }

}

export default SendTweet;
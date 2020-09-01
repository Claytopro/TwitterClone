import React from 'react';
import styles from './mediasidebar.module.css'

//components
import SearchBar from '../SearchBar/Searchbar'
import SidePhotos from '../SidePhotos/SidePhotos'


function Mediasidebar (props) {
    
       return(    
           <div className = {styles.mediasidebar_container}> 
                <SearchBar/> 
                {(props.userImages.length >0) && <SidePhotos user = {props.user} userImages = {props.userImages}/> }
           </div>
       )
  
}

export default Mediasidebar;
   

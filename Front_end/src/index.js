import React from 'react';
import ReactDOM from 'react-dom';

import User from './components/User/User.js'
import Register from './components/Register/Register'
import Home from './components/Home/Home.js';
import {BrowserRouter,Route,Switch} from 'react-router-dom';


function App (){
  
    return(
      <div id = "main-wrapper">
      
        <Switch>
          <Route exact path ="/" component = {Home}/>
          <Route exact path ="/home" component = {Home}/>
          <Route exact path ="/register" component = {Register}/>
          <Route path = "*" component = {User} />
        </Switch>
        
      </div>
    );
};


ReactDOM.render(
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';

import User from './components/User/User.js'
import Register from './components/Register/Register'
import Home from './components/Home/Home.js';
import Settings from './components/Settings/Settings'
import {BrowserRouter,Route,Switch,withRouter} from 'react-router-dom';


function App (){
  
    return(
      <div id = "main-wrapper">
      
        <Switch>
          <Route exact path ="/" component = {Home}/>
          <Route exact path ="/home" component = {Home}/>
          <Route exact path ="/register" component = {Register}/>
          <Route exact path ="/settings" component = {Settings}/>

          <Route exact path = "*" component = {withRouter(User)} />
        </Switch>
        
      </div>
    );
};


ReactDOM.render((
  <BrowserRouter>
    <Route component={App} />
  </BrowserRouter>
), document.getElementById('root'))

import React, { Component } from 'react';
import AppNav from './AppNav';

class Home extends Component {
    state = {  }
    render() { 
        return (
             <div>
                 <AppNav/>
                 <center>
                     <h3>Welcome to easy expense app!</h3>
                 </center>
             </div>
         );
    }
}
 
export default Home;
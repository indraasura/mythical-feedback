import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from './fileupload'
import M from 'materialize-css'


class Main extends Component {
    state = {  }
    componentDidMount(){
        M.AutoInit()
    }
    render() { 
        return ( 
            <div>
                <nav className = "nav-bg">
                    <div className="nav-wrapper">
                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                            <li><Link to={'/'}>Home</Link></li>
                            <li><Link to={'/excel'}>View Sheet</Link></li>
                            <li><Link to={'/script-builder'}>Script Builder</Link></li>
                            <li><Link to={'/contact'}>Contact Us</Link></li>
                        </ul>
                    </div>
                </nav>
                <FileUpload />
                
            </div>
         );
    }
}
 
export default Main
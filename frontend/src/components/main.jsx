import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from './fileupload'
import M from 'materialize-css'
import './main.css';

class Main extends Component {
    state = {  }
    componentDidMount(){
        // document.getElementsByClassName('main-loading-screen')[0].style.visibility = 'hidden';
        M.AutoInit()
    }
    render() { 
        return ( 
            <div>
                {/*<nav className = "nav-bg">*/}
                    {/*<div className="nav-wrapper">*/}
                        {/*<ul id="nav-mobile" className="right hide-on-med-and-down">*/}
                            {/*<li><Link to={'/'}>Home</Link></li>*/}
                            {/*<li><Link to={'/excel'}>View Sheet</Link></li>*/}
                            {/*<li><Link to={'/script-builder'}>Script Builder</Link></li>*/}
                            {/*<li><Link to={'/contact'}>Contact Us</Link></li>*/}
                        {/*</ul>*/}
                    {/*</div>*/}
                {/*</nav>*/}
                <div className={"main-background-grad-1"}>
                </div>
                <div className={"main-background-grad-2"}></div>
                <div className={"main-background-grad-3"}></div>
                <FileUpload />
                
            </div>
         );
    }
}
 
export default Main
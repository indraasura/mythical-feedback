import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FileUpload from './fileupload'
import M from 'materialize-css'
import './main.css';
import HomeMenu from "./HomeMenu";

class Main extends Component {
    state = {
        coordX: 0,
        coordY: 0,
        activeMenu: false,
    };

    componentDidMount() {
        // document.getElementsByClassName('main-loading-screen')[0].style.visibility = 'hidden';
        M.AutoInit()
    }


    showCoords(e) {
        console.log(e.clientX);
        console.log(e.clientY);
        this.setState({
            coordX: e.clientX - 13,
            coordY: e.clientY - 13,
            activeMenu: true
        })
    }

    render() {
        return (
            <div>
                <HomeMenu positionX={this.state.coordX} positionY={this.state.coordY} active={this.state.activeMenu}/>
                <div onClick={this.showCoords.bind(this)}>
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
                    <FileUpload/>

                </div>
            </div>
        );
    }
}

export default Main
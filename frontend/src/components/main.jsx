import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FileUpload from './fileupload'
import M from 'materialize-css'
import './main.css';
import HomeMenu from "./HomeMenu";
import mouse_left from '../resources/mouse_left.png';
import mobile_touch from '../resources/mobile_touch.png';
import {isMobile} from "react-device-detect";
import home_image from "../resources/home.png";


class Main extends Component {
    state = {
        coordX: 0,
        coordY: 0,
        helperImage: mouse_left,
        activeMenu: false,
        homeMenuName: {
            'grad-0': 'Home',
            'grad-1': 'About',
            'grad-2': 'How it works',
            'grad-3': 'Technologies used',
            'grad-4': 'About me',
        }
    };

    componentWillMount() {
        if (isMobile) {
            this.setState({
                helperImage: mobile_touch
            });
        } else {
            this.setState({
                helperImage: mouse_left
            });
        }
    }

    componentDidMount() {
        // document.getElementsByClassName('main-loading-screen')[0].style.visibility = 'hidden';
        M.AutoInit();
    }


    showCoords(e) {
        console.log(window.innerWidth, window.innerHeight, e.clientX, e.clientY);
        this.setState({
            // left: "-35vmin", top: "-40vmin"
            coordX: (e.clientX - 13),
            coordY: (e.clientY - 13),
            activeMenu: true
        })
    }

    vh(v) {
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return (v * h) / 100;
    }

    vw(v) {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        return (v * w) / 100;
    }

    vmin(v) {
        return Math.min(this.vh(v), this.vw(v));
    }

    vmax(v) {
        return Math.max(this.vh(v), this.vw(v));
    }

    changeColors(name) {
        console.log('Changing');
        document.getElementsByClassName('main-background-grad')[0].classList.remove('grad-0');
        document.getElementsByClassName('main-background-grad')[0].classList.remove('grad-1');
        document.getElementsByClassName('main-background-grad')[0].classList.remove('grad-2');
        document.getElementsByClassName('main-background-grad')[0].classList.remove('grad-3');
        document.getElementsByClassName('main-background-grad')[0].classList.remove('grad-4');
        document.getElementsByClassName('main-background-grad')[0].classList.add('main-background-grad-hover');
        document.getElementsByClassName('main-background-grad')[0].classList.add(name);
    }

    resetMenuHandler = () => {
        M.Toast.dismissAll();
        setTimeout(() => {
            this.setState({
                activeMenu: false,
            });
        }, 500)
    };

    menuOverHandler = (e) => {
        console.log('HELLO', e);
        M.Toast.dismissAll();
        M.toast({html: this.state.homeMenuName[e]}, 1000);
        this.changeColors(e);
    };

    resetBackgroundMenuHandler = (e) => {
        document.getElementsByClassName('main-background-grad')[0].classList.remove('main-background-grad-hover');
    };

    clickHandler = (e) => {
        console.log(e);
        this.resetMenuHandler();
    };

    render() {
        return (
            <div onClick={this.showCoords.bind(this)}>
                <HomeMenu positionX={this.state.coordX} positionY={this.state.coordY} active={this.state.activeMenu}
                          resetMenuHandler={this.resetMenuHandler}
                          menuOverHandler={this.menuOverHandler}
                          resetBackgroundMenuHandler={this.resetBackgroundMenuHandler}
                          clickHandler={this.clickHandler}/>
                {/*<div className={"center-image"} style={{position: "absolute", zIndex: 2}}>*/}
                {/*</div>*/}
                <div className={"bg"} style={{zIndex: 2}}>
                </div>
                <div>
                    <div style={{position: "fixed", bottom: "0", zIndex: 2}}>
                        <img src={this.state.helperImage} style={{width: "20vh"}}/>
                    </div>
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
                    <div className={"main-background-grad"}>
                    </div>
                    {/*<div className={"main-background-grad-2"}></div>*/}
                    {/*<div className={"main-background-grad-3"}></div>*/}
                    {/*<FileUpload/>*/}

                </div>
            </div>
        );
    }
}

export default Main
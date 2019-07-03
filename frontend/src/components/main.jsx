import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FileUpload from './fileupload'
import M from 'materialize-css'
import './main.css';
import HomeMenu from "./HomeMenu";
import mouse_left from '../resources/mouse_left.png';

class Main extends Component {
    state = {
        coordX: 0,
        coordY: 0,
        activeMenu: false,
        homeMenuName: {
            'grad-0': 'Home',
            'grad-1': 'About',
            'grad-2': 'Applications',
            'grad-3': 'How it Works',
            'grad-4': 'Technologies',
        }
    };

    componentDidMount() {
        // document.getElementsByClassName('main-loading-screen')[0].style.visibility = 'hidden';
        M.AutoInit()
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

    render() {
        return (
            <div>
                <HomeMenu positionX={this.state.coordX} positionY={this.state.coordY} active={this.state.activeMenu}
                          resetMenuHandler={this.resetMenuHandler}
                          menuOverHandler={this.menuOverHandler}
                          resetBackgroundMenuHandler={this.resetBackgroundMenuHandler}/>
                <div onClick={this.showCoords.bind(this)}>
                    {/*<div className={"center"} style={{position: "absolute", bottom: "10px", left: "90vh", float: "left", zIndex: 2}}>*/}
                    {/*<img src={mouse_left} style={{width: "50px"}} />*/}
                        {/*<div className={"white-text"} style={{fontSize: "12px"}}><i>Click Anywhere to Navigate</i></div>*/}
                    {/*</div>*/}
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
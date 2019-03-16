import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import TrayWidget from './TrayWidget';
import TrayItemWidget from './TrayItemWidget';
class Sidebar extends Component {
    componentDidMount() {
        var elem = document.querySelector(".sidenav");
        var instance = M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250
        });
    }

    render() {
        return (
            <div>
                <ul id="slide-out" className="sidenav sidenav-fixed">
                    <li>
                        <div className="user-view">
                            <div className="background grey">
                                <img src="" />
                            </div>
                            <a href=""><img className="circle" src="http://chittagongit.com//images/user-icon-image/user-icon-image-2.jpg" /></a>
                            <a href=""><span className="white-text name">Shashank Sharma</span></a>
                            <a href=""><span className="white-text email">jdandturk@gmail.com</span></a>
                        </div>
                    </li>
                    <li><a className="subheader">Tray</a></li>
                    <li>
                        <TrayWidget>
                            <TrayItemWidget model={{ type: 'in' }} name="In Node" color="peru" />
                            <TrayItemWidget model={{ type: 'out' }} name="Out Node" color="hotpink" />
                            <TrayItemWidget model={{ type: 'out-in' }} name="OutIN Node" color="hotpink" />
                        </TrayWidget>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
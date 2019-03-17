import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import TrayWidget from './TrayWidget';
import TrayItemWidget from './TrayItemWidget';
import './sidenav.css';
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
                <ul id="slide-out" className="sidenav sidenav-fixed card-look-side-nav">
                    <li><a className="subheader">Tray (Drag and drop)</a></li>
                    <li>
                        <TrayWidget>
                            <TrayItemWidget model={{ type: 'in' }} name="End Node" color="peru" />
                            <TrayItemWidget model={{ type: 'out' }} name="Source Node" color="hotpink" />
                            <TrayItemWidget model={{ type: 'out-in' }} name="Middle Node" color="hotpink" />
                        </TrayWidget>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
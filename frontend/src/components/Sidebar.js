import React, {Component} from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import TrayWidget from './TrayWidget';
import TrayItemWidget from './TrayItemWidget';
import './sidenav.css';
import {config} from '../resources/config';

class Sidebar extends Component {

    state = {
        builder_json: [],
        mainSideNav: 'create',
        hideIcon: 'keyboard_arrow_left',
        hideIconText: "close"
    };

    componentDidMount() {
        // const elem = document.querySelector(".sidenav");
        // const instance = M.Sidenav.init(elem, {
        //     edge: "left",
        //     inDuration: 250
        // // });
        document.addEventListener('DOMContentLoaded', function () {
            const elems = document.querySelectorAll('.tooltipped');
            const instances = M.Tooltip.init(elems, {enterDelay: 300});
        });

        // TODO: Get some help, change it, do something
        setTimeout(() => {
            const elem = document.getElementsByClassName("subsidenav")[0];
            elem.style.transform = "translateX(3.5%)";
        }, 5)

    }

    componentWillMount() {
    }

    getFileDetails(id, name, func) {
        fetch(config.API_URL + '/builder/getit/' + id)
            .then(res => res.json())
            .then(data => {
                console.log('are bhai bhai', data);
            });
    }

    getFileList() {
        this.setState({
            builder_json: []
        });
        setTimeout(() => {
            fetch(config.API_URL + '/builder/view/')
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    this.setState({
                        builder_json: data
                    });
                });
            console.log(this.state.excel_json)
        }, 2000);
    }

    switchFolderNav() {
        this.setState({
            mainSideNav: 'folder'
        });
        this.getFileList();
    }

    hideNav() {
        const elem = document.getElementsByClassName("subsidenav")[0];
        if (this.state.hideIcon === 'keyboard_arrow_left') {
            this.setState({
                hideIcon: 'keyboard_arrow_right',
                hideIconText: 'open'
            });
            elem.style.transform = "translateX(-150%)";
        } else {
            this.setState({
                hideIcon: 'keyboard_arrow_left',
                hideIconText: 'close'
            });
            elem.style.transform = "translateX(3.5%)";
        }
    }

    switchSettingsNav() {
        this.setState({
            mainSideNav: 'settings'
        });
    }

    render() {
        return (
            <div>
                <div className="card document-name">
                    <input placeholder="Document Name" id="document_name" type="text" className="document-name-input"/>
                    <a className={"dropdown-trigger tooltipped"}
                       href={""}
                       data-target='dropdown1'
                       data-position="bottom" data-tooltip="Options"><i className="material-icons document-dropdown white-text">arrow_drop_down</i></a>
                    <ul id='dropdown1' className='dropdown-content document-dropdown-options' style={{left: "24px !important;"}}>
                        <li><a href="#!">one</a></li>
                        <li><a href="#!">two</a></li>
                        <li className="divider" tabIndex="-1"></li>
                        <li><a href="#!">three</a></li>
                        <li><a href="#!"><i className="material-icons">view_module</i>four</a></li>
                        <li><a href="#!"><i className="material-icons">cloud</i>five</a></li>
                    </ul>
                </div>
                <ul id="slide-out" className="sidenav sidenav-fixed fixed-side-nav"
                    style={{backgroundColor: "#393939"}}>
                    <li className={"side-hover"}>
                        <button style={{height: "60px"}} className={"more side-buttons tooltipped"}
                                data-position="right" data-tooltip="Dashboard">
                            <div><i className="icon-side material-icons white-text">dashboard</i></div>
                        </button>
                    </li>
                    <li className={"side-hover"}>
                        <button style={{height: "60px"}} className={"more side-buttons tooltipped"}
                                data-position="right" data-tooltip="Add Elements"
                                onClick={() => {
                                    this.setState({
                                        mainSideNav: 'create'
                                    })
                                }}>
                            <div><i className="icon-side material-icons white-text">add</i></div>
                        </button>
                    </li>
                    <li className={"side-hover"}>
                        <button style={{height: "60px"}} className={"more side-buttons tooltipped"}
                                data-position="right" data-tooltip="Folder"
                                onClick={() => {
                                    this.switchFolderNav()
                                }}>
                            <div><i className="icon-side material-icons white-text">folder</i></div>
                        </button>
                    </li>
                    <li className={"side-hover"}>
                        <button style={{height: "60px"}} className={"more side-buttons tooltipped"}
                                data-position="right" data-tooltip="Settings"
                                onClick={() => {
                                    this.switchSettingsNav()
                                }}>
                            <div><i className="icon-side material-icons white-text">settings</i></div>
                        </button>
                    </li>
                    <li className={"side-hover bottom-hide-nav"}>
                        <button style={{height: "60px"}} className={"more side-buttons tooltipped"}
                                data-position="right" data-tooltip={this.state.hideIconText}
                                onClick={() => {
                                    this.hideNav()
                                }}>
                            <div><i className="icon-side material-icons white-text">{this.state.hideIcon}</i></div>
                        </button>
                    </li>
                </ul>
                <ul id="slide-out" className="subsidenav sidenav sidenav-fixed card-look-side-nav"
                    style={{backgroundColor: "white"}}>
                    {(() => {
                        switch (this.state.mainSideNav) {
                            case "create":
                                return (
                                    <>
                                        <li>
                                            <div className="subheader" style={{paddingLeft: "20px"}}>Tray (Drag and
                                                drop)
                                            </div>
                                        </li>
                                        <li>
                                            <TrayWidget>
                                                <TrayItemWidget model={{type: 'in'}} name="End Node" color="peru"/>
                                                <TrayItemWidget model={{type: 'out'}} name="Source Node"
                                                                color="hotpink"/>
                                                <TrayItemWidget model={{type: 'out-in'}} name="Middle Node"
                                                                color="hotpink"/>
                                                <TrayItemWidget model={{type: 'diamond'}} name="Condition Node"
                                                                color="hotpink"/>
                                            </TrayWidget>
                                        </li>
                                    </>
                                );
                            case "folder":
                                return (
                                    (this.state.builder_json.length > 0) ?
                                        <div>
                                            <li>
                                                <div className="subheader" style={{paddingLeft: "20px"}}>Recents</div>
                                            </li>
                                            <li>
                                                {this.state.builder_json.map((item, index) => {
                                                    return (
                                                        <a href={"#"} onClick={() => {
                                                            this.getFileDetails(this.props.changeScript(item.id))
                                                        }}>
                                                            <div><i
                                                                className="inline-icon material-icons">insert_chart</i>{item.name}
                                                            </div>
                                                        </a>
                                                    )
                                                })}
                                            </li>
                                        </div> :
                                        <div className="preloader-wrapper big active side-loader">
                                            <div className="spinner-layer spinner-blue-only">
                                                <div className="circle-clipper left">
                                                    <div className="circle"></div>
                                                </div>
                                                <div className="gap-patch">
                                                    <div className="circle"></div>
                                                </div>
                                                <div className="circle-clipper right">
                                                    <div className="circle"></div>
                                                </div>
                                            </div>
                                        </div>
                                );
                            case "settings":
                                return (
                                    <li>
                                        <div className="subheader" style={{paddingLeft: "20px"}}>Settings</div>
                                    </li>
                                );
                            default:
                                return ("");
                        }
                    })()}
                </ul>

            </div>
        );
    }
}

export default Sidebar;
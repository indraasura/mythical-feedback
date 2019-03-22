import React, { Component } from "react";
import M from "materialize-css/dist/js/materialize.min.js";
import "materialize-css/dist/css/materialize.min.css";
import TrayWidget from './TrayWidget';
import TrayItemWidget from './TrayItemWidget';
import './sidenav.css';


class Sidebar extends Component {

    state = {
        builder_json: []
    };

    componentDidMount() {
        var elem = document.querySelector(".sidenav");
        var instance = M.Sidenav.init(elem, {
            edge: "left",
            inDuration: 250
        });
    }

    componentWillMount(){
        fetch('http://127.0.0.1:8000/builder/view/')
            .then(res=>res.json())
            .then(data=>{
                console.log(data);
                this.setState({
                    builder_json: data
                });
            });
        console.log(this.state.excel_json)
    }

    getFileDetails(id, name, func){
        fetch('http://127.0.0.1:8000/builder/getit/'+id)
            .then(res=>res.json())
            .then(data=>{
                console.log('are bhai bhai', data);
            });
    }

    render() {
        return (
            <div>
                <ul id="slide-out" className="sidenav sidenav-fixed fixed-side-nav" style={{backgroundColor: "#393939"}}>
                    <li>
                        <a href={"#"} style={{height: "60px"}}>
                            <div><i className="icon-side material-icons white-text">add</i></div>
                        </a>
                    </li>
                    <li>
                        <a href={"#"} style={{height: "60px"}}>
                            <div><i className="icon-side material-icons white-text">folder</i></div>
                        </a>
                    </li>
                </ul>
                <ul id="slide-out" className="sidenav sidenav-fixed card-look-side-nav">
                    <li><a className="subheader">Tray (Drag and drop)</a></li>
                    <li>
                        <TrayWidget>
                            <TrayItemWidget model={{ type: 'in' }} name="End Node" color="peru" />
                            <TrayItemWidget model={{ type: 'out' }} name="Source Node" color="hotpink" />
                            <TrayItemWidget model={{ type: 'out-in' }} name="Middle Node" color="hotpink" />
                            <TrayItemWidget model={{ type: 'diamond' }} name="Condition Node" color="hotpink" />
                        </TrayWidget>
                    </li>
                    <li><a className="subheader">Recents</a></li>
                    <li>
                        {this.state.builder_json.map((item, index)=>{
                            return (
                                <a href={"#"} onClick={() => {this.getFileDetails(this.props.changeScript(item.id))}}>
                                    <div><i className="inline-icon material-icons">insert_chart</i>{item.name}</div>
                                </a>
                            )
                        })}
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
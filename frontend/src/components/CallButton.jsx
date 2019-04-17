import React, { Component } from 'react';
import '../App.css'
import './CallButton.css';

class CallButton extends Component {
    constructor(props) {
        super(props);
        console.log('wwww', props);
    }

    componentDidMount() {
        document.getElementById("search").addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                console.log(event.target.value);
                document.getElementById("search").style.width = "10px";
                document.getElementById("call-icon").classList.add("visible");
                document.getElementById("call-icon").classList.remove("hidden");
                document.getElementById('search').value = '';
                document.getElementById("search").blur();
                this.props.callPhone();
                setTimeout(function() {
                    document.getElementById("search").style.background = "#00e676";
                    document.getElementById("search").classList.add("call-animation");
                }, 1000);

            }
        });
        document.getElementById("callButton").onclick = function(){
            if (document.getElementById("search").style.width === '250px') {
                document.getElementById("search").style.width = "50px";
                document.getElementById('search').value = '';
                document.getElementById("search").blur();
            } else {
                document.getElementById("call-icon").classList.add("hidden");
                document.getElementById("search").style.width = "250px";
                document.getElementById("search").focus();
            }
        }
    }

    removeInputFocus() {
        document.getElementById("search").style.width = "10px";
        document.getElementById("call-icon").classList.add("visible");
        document.getElementById("call-icon").classList.remove("hidden");
        document.getElementById('search').value = '';
        document.getElementById("search").blur();
    }

    state = {
        value: ''
    };
    render() {

        return (
                <div className="container-2">
                    <a href="javascript: void(0);" id="callButton"><span className="icon" id="call-icon"><i
                        className="fa fa-phone fa-2x"></i></span></a>
                    <input className="" placeholder={"+91789891xxxx"} type="search" id="search" onChange={this.props.handleInput}
                           onBlur={() => {this.removeInputFocus()}} autoComplete="off" maxLength="15"/>
                </div>
        );
    }
}

export default CallButton;
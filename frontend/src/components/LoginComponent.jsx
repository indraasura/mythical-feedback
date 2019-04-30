import React, { Component } from 'react';
import './LoginComponent.css';
import mythicalNegative from '../resources/mythical-negative.png';
import mythical from '../resources/mythical.png';

class LoginComponent extends Component {
    state = {
        backgroundColor: 'white',
        mythicalLogo: mythical
    };
    render() {
        return (
            <div>
                <div className={"row"} style={{marginBottom: 0}}>
                    <div className={"col s4 center"} style={{backgroundColor: "grey", minHeight: "100vh"}}>
                        <div className={"input-field col s10 center white-text"}>
                            <input placeholder="Phone Number" id={"login-phone_number"} type="text" className={"validate"} />
                            <input placeholder="Password" id={"login-password"} type="password" className={"validate"}
                                   onFocus={() => {
                                this.setState({
                                    backgroundColor: "#212121",
                                    mythicalLogo: mythicalNegative
                                })
                            }}
                            onBlur={() => {
                                this.setState({
                                    backgroundColor: "white",
                                    mythicalLogo: mythical
                                })
                            }}/>
                        </div>
                    </div>
                    <div className={"col s8 logo-background"} style={{backgroundColor: this.state.backgroundColor, minHeight: "100vh"}}>
                        <img className={"logo-background"} style={{display: "block", margin: "auto", marginTop: "10%", width: "60%"}} src={this.state.mythicalLogo} alt={"Mythical Logo"}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginComponent;
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
                    <div className={"col s4 center"} style={{backgroundColor: "#e3f2fd", minHeight: "100vh"}}>
                        <div className="card" style={{margin: "20px", display: "block", marginTop: "40%"}}>
                            <div className="card-content black-text">
                                <span className="card-title">Login</span>
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
                            <button className={'btn btn-large'} style={{float: 'left'}}>Submit</button>
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
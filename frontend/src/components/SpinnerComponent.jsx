import React, {Component} from 'react';
import fire_load_large from '../resources/fire_load_large.gif';
import './SpinnerComponent.css'

class SpinnerComponent extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            (this.props.isLoading) ?
                <div className={"sidenav-overlay"} id="main-loading-screen"
                     style={{display: "block", zIndex: 6, backgroundColor: "white", opacity: this.props.opacity}}>
                    <img src={fire_load_large} style={{display: "block", margin: "auto", marginTop: "0"}}/>
                </div>
                :<div></div>

        );
    }
}

export default SpinnerComponent;
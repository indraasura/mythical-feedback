import React, {Component} from 'react';
import fire_load_large from '../resources/fire_load_large.gif';

class SpinnerComponent extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            (this.props.isLoading) ?
                <div className={"sidenav-overlay"} id="main-loading-screen"
                     style={{display: "block", opacity: 1, zIndex: 6, backgroundColor: "white"}}>
                    <img src={fire_load_large} style={{display: "block", margin: "auto", marginTop: "0"}}/>
                </div>
                :<div></div>

        );
    }
}

export default SpinnerComponent;
import React, {Component} from 'react';
import './HomeMenu.css';

class HomeMenu extends Component {
    state = {};

    componentDidMount() {

    }

    render() {
        return (
            <div>
                {(this.props.active) ?
                    <div className="wrap" style={{position: "fixed", left: this.props.positionX-240,
                        top: this.props.positionY-240}}>
                        <a href="#">
                            <div></div>
                        </a>
                        <a href="#">
                            <div></div>
                        </a>
                        <a href="#">
                            <div></div>
                        </a>
                        <a href="#">
                            <div></div>
                        </a>
                        <a href="#">
                            <div></div>
                        </a>
                    </div> : <div></div>}
            </div>
        );
    }
}

export default HomeMenu;
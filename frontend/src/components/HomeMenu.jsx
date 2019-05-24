import React, {Component} from 'react';
import './HomeMenu.css';
import M from "materialize-css/dist/js/materialize.min";

class HomeMenu extends Component {
    state = {};

    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function () {
            const elems = document.querySelectorAll('.tooltipped');
            M.Tooltip.init(elems, {enterDelay: 300});
        });
    }

    render() {
        return (
            <div>
                {(this.props.active) ?
                    <div className="wrap" style={{position: "fixed", left: this.props.positionX-240,
                        top: this.props.positionY-240, zIndex: 2}} onMouseLeave={this.props.resetMenuHandler}>
                        <a>
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-1')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-1')}>

                            </div>
                        </a>
                        <a href="#">
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-2')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-2')}>

                            </div>
                        </a>
                        <a href="#">
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-3')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-3')}>

                            </div>
                        </a>
                        <a href="#">
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-4')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-4')}>

                            </div>
                        </a>
                        <a href="#">
                            <div>
                            </div>
                        </a>
                    </div> : <div></div>}
            </div>
        );
    }
}

export default HomeMenu;
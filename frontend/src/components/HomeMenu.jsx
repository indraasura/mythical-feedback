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
            <div className={"wrap2"} style={{left: this.props.positionX,
                top: this.props.positionY, zIndex: 3}}>
                {(this.props.active) ?
                    <div className="wrap" style={{position: "relative", left: "-35vmin", top: "-40vmin"}} onMouseLeave={this.props.resetMenuHandler}>
                        <a className={"home-menu"}>
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-1')}
                                 onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-1')}
                                 onClick={() => {this.props.clickHandler('grad-1')}}>

                            </div>
                        </a>
                        <a className={"home-menu"} href="#">
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-2')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-2')}>

                            </div>
                        </a>
                        <a className={"home-menu"} href="#">
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-3')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-3')}>

                            </div>
                        </a>
                        <a className={"home-menu"} href="#">
                            <div onMouseOver={this.props.menuOverHandler.bind(this, 'grad-4')} onMouseOut={this.props.resetBackgroundMenuHandler.bind(this, 'grad-4')}>

                            </div>
                        </a>
                        <a className={"home-menu"} href="#">
                            <div>
                            </div>
                        </a>
                    </div> : <div></div>}
            </div>
        );
    }
}

export default HomeMenu;
import React, { Component } from 'react';
import Main from './components/main';
// import Footer from './components/footer';
import ExcelData from './components/exceldata';
import ScriptBuilder from './components/ScriptBuilder';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import M from 'materialize-css'
import './App.css'

class App extends Component {
    state = {  };
    componentDidMount(){
        M.AutoInit()
    }
    render() {
        return (
            <Router>
                <div>
                    {/*<nav className = "nav-bg">*/}
                        {/*<div className="nav-wrapper">*/}
                            {/*<ul id="nav-mobile" className="right hide-on-med-and-down">*/}
                                {/*<li><Link to={'/'}>Home</Link></li>*/}
                                {/*<li><Link to={'/excel'}>View Sheet</Link></li>*/}
                                {/*<li><Link to={'/script-builder'}>Script Builder</Link></li>*/}
                                {/*<li><Link to={'/contact'}>Contact Us</Link></li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</nav>*/}
                    <Switch>
                        <Route exact path='/' component={Main} />
                        <Route path='/about' component={Main} />
                        <Route path='/excel' component={ExcelData} />
                        <Route path='/script-builder' component={ScriptBuilder} />
                    </Switch>
                    {/*<Footer />*/}
                </div>
            </Router>
         );
    }
}

export default App;
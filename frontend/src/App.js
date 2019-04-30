import React, { Component } from 'react';
import Main from './components/main';
import Footer from './components/footer';
import ExcelData from './components/exceldata';
import ScriptBuilder from './components/ScriptBuilder';
import LoginComponent from './components/LoginComponent';
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
                    <Switch>
                        <Route exact path='/' component={Main} />
                        <Route path='/about' component={Main} />
                        <Route path='/excel' component={ExcelData} />
                        <Route path='/script-builder' component={ScriptBuilder} />
                        <Route path='/login' component={LoginComponent} />
                    </Switch>
                    {/*<Footer />*/}
                </div>
            </Router>
         );
    }
}

export default App;
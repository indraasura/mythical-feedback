import React, {Component} from 'react';
import Main from './components/main';
import Footer from './components/footer';
import ExcelData from './components/exceldata';
import ScriptBuilder from './components/ScriptBuilder';
import LoginComponent from './components/LoginComponent';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import M from 'materialize-css'
import './App.css'
import SpinnerComponent from "./components/SpinnerComponent";

class App extends Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        M.AutoInit();
        setTimeout(() => {
            this.setState({
                loading: false,
            })
        }, 1000)
    }

    render() {
        return (
            <div>
                <SpinnerComponent isLoading={this.state.loading}/>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path='/' component={Main}/>
                            <Route path='/about' component={Main}/>
                            <Route path='/excel' component={ExcelData}/>
                            <Route path='/script-builder' component={ScriptBuilder}/>
                            <Route path='/login' component={LoginComponent}/>
                        </Switch>
                        {/*<Footer />*/}
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
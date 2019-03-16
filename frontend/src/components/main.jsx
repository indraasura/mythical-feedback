import React, { Component } from 'react';
import FileUpload from './fileupload'
import M from 'materialize-css'


class Main extends Component {
    state = {  }
    componentDidMount(){
        M.AutoInit()
    }
    render() { 
        return ( 
            <div>
                Main content will go here
                <FileUpload />
                
            </div>
         );
    }
}
 
export default Main
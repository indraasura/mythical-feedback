import React, { Component } from 'react';
import M from 'materialize-css';
import Data from '../data.json'
import './exceldata.css';


const TableRow = props => (
    <tr>
        {props.data.map((item, index) => {
            return (
        <td className="" id={index}>{item}</td>
            )
    })}
        {/*<td className = "card green lighten-4" style = {{width: '8%'}}><button className = "btn green darken-3 white-text waves-effect"> <i className="material-icons">call</i></button></td>*/}
    </tr>
);

const TableHeader = props => (
    <tr>
        {props.data.map((item, index) => {
            return (
                <th className = "">{item}</th>
            )
        })}
    </tr>
);

const TableBody = props => (
    <tbody>
    {props.data['data'].map((dataDetail, index)=>{
            return (
                <TableRow data={dataDetail}/>
            )
        })}
    </tbody>
);

class ExcelData extends Component {
    state = { 
        excel_json: false
     }
    componentWillMount(){
        fetch('http://127.0.0.1:8000/excel/get/?id=3&filename=Technical_Club_Responses.xlsx')
            .then(res=>res.json())
            .then(data=>{
                console.log(data);
                this.setState({
                    excel_json: data
                });
            })
        console.log(this.state.excel_json)
    }

    componentDidMount(){
        M.AutoInit()
    }
    render() {
        console.log('asdasd', this.state.excel_json, !this.state.excel_json);
        if (!this.state.excel_json) {
            console.log('YES');
            return (
                <div className="preloader-wrapper big active center-loader loader">
                    <div className="spinner-layer spinner-blue-only">
                        <div className="circle-clipper left">
                            <div className="circle"></div>
                        </div>
                        <div className="gap-patch">
                            <div className="circle"></div>
                        </div>
                        <div className="circle-clipper right">
                            <div className="circle"></div>
                        </div>
                    </div>
                </div>
            )
        }
        // const rowCount = this.state['data'][0].length;
        return ( 
            <div>
                <h3>Found data: 32</h3>
                <table className = "striped highlight centered responsive-table" id = "data-table">
                    <thead>
                            <TableHeader data={this.state.excel_json['heading']}/>
                    </thead>
                        <TableBody data={this.state.excel_json}/>
                </table>
            </div>
         );
    }
}
 
export default ExcelData;
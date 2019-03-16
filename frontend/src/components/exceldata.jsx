import React, { Component } from 'react';
import M from 'materialize-css';
import Data from '../data.json'



class ExcelData extends Component {
    state = { 
        data:[]
     }
    componentWillMount(){
        fetch('https://2ffa8748.ngrok.io/')
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                this.setState(data)
            })
    }

    componentDidMount(){
        M.AutoInit()
    }
    render() { 
        return ( 
            <div>
                <table className = "centered responsive-table" id = "data-table">
                    <thead>
                        <tr>
                            <th className = "card blue darken-3 white-text" style = {{width:'23%'}}>Name</th>
                            <th className = "card orange darken-3 white-text" style = {{width:'23%'}}>Email</th>
                            <th className = "card red darken-3 white-text" style = {{width:'23%'}}>Year</th>
                            <th className = "card purple darken-3 white-text" style = {{width:'23%'}}>Languages known</th>
                            <th className = "card green darken-3 white-text" style = {{width: '8%'}}>Call</th>
                        </tr>
                    </thead>
                </table>
                {Data.map((dataDetail, index)=>{
                    return (
                        <table className = "centered responsive-table">
                            <thead>
                               
                            </thead>
                            <tbody>
                                <tr>
                                    <td className = "card blue lighten-3" style = {{width:'23%'}}>{dataDetail.Name}</td>
                                    <td className = "card orange lighten-3" style = {{width:'23%'}}>{dataDetail.Email}</td>
                                    <td className = "card red lighten-3" style = {{width:'23%'}}>{dataDetail.Year}</td>
                                    <td className = "card purple lighten-3" style = {{width:'23%'}}>{dataDetail.Languages}</td>
                                    <td className = "card green lighten-4" style = {{width: '8%'}}><button className = "btn green darken-3 white-text waves-effect"> <i class="material-icons">call</i></button></td>
                                </tr>
                            </tbody>
                        </table>
                    )
                })}
            </div>
         );
    }
}
 
export default ExcelData;
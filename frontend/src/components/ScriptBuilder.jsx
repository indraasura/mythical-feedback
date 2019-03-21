import React from 'react';
import Lodash from 'lodash';
import {
    DiagramWidget,
    DiagramEngine,
    DefaultNodeFactory,
    DefaultLinkFactory,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramModel
} from 'storm-react-diagrams';
import 'storm-react-diagrams/dist/style.min.css';
import './srd.css';
import Sidebar from './Sidebar'
// import Modal from "./Modal";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import CallButton from "./CallButton";

const ShareToast ='<textarea style="font-size:12px;color: white" rows="8" cols="40" id="textarea2" class="materialize-textarea" data-length="120">' +
    'https://127.0.0.1:8000/static/css/call.css\n' +
    'https://127.0.0.1:8000/static/js/call.js\n' +
    '&lt;div class=&quot;mythical-call&quot;&gt;&lt;/div&gt;\n' +
    '</textarea>';


class ScriptBuilder extends React.Component {
    static defaultProps = {
        node: null
    };
    state = {
        input_text: '',
        iid: '',
        isLoading: false,
        callButtonValue: '',
        surveyId: '',
        engine: '',
        responseId: '',
        sideJSON: '',
    };

    componentWillMount() {
        this.engine = new DiagramEngine();
        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
    }

    generateJson() {
        this.setState({
            isLoading: true
        });
        console.log(this.state);
        fetch('http://127.0.0.1:8000/builder/upload/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Random Name',
                script_flow: this.engine.getDiagramModel().serializeDiagram(),
            })
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status == 500) {
                    return
                } else {
                    this.setState({
                        surveyId: response.id
                    })
                }
            });
        setTimeout(() => { this.setState({
            isLoading: false
        });
        if (this.state.surveyId != '') {
            console.log(this.engine.getDiagramModel().serializeDiagram());
                document.getElementById("generate-button").style.backgroundColor = "#4caf50";
                M.toast({html: ShareToast});
        } else {
            document.getElementById("generate-button").style.backgroundColor = "#f44336";
        }
        }, 3000);
    }

    handleInput() {
        // let iid = this.engine.getDiagramModel().serializeDiagram().nodes[0].id;
        const iid = this.state.iid;
        let engineState = this.state.engine.getDiagramModel().serializeDiagram();
        let counter = 0
        console.log(iid);
        console.log(engineState);
        console.log(engineState.nodes);
        console.log(engineState.nodes[iid]);
        if (!engineState.nodes.hasOwnProperty(iid)) {
            console.log('NOT FOUND');
            setTimeout(() => {
                engineState = this.engine.getDiagramModel().serializeDiagram();
                this.engine.getDiagramModel().nodes[iid].name = document.getElementById('question_text').value;
                document.getElementById('question_text').value = '';
                this.engine.repaintCanvas();
            }, 1000)
        } else {
            this.engine.getDiagramModel().nodes[iid].name = document.getElementById('question_text').value;
            document.getElementById('question_text').value = '';
            this.engine.repaintCanvas();
        }
    }

    callHandleInput = (e) => {
        this.setState({
            callButtonValue: e.target.value
        })
    };

    callPhone = () => {
        console.log('Calling');
        fetch('http://127.0.0.1:8000/autocall/call/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to_phonenumber: this.state.callButtonValue,
                survey: this.state.surveyId,
            })
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    responseId: response.id
                })
            });

        var timer = setInterval(() => {
            fetch('http://127.0.0.1:8000/autocall/survey/responses/' + this.state.responseId, {
                method: 'GET'
            }).then(response => response.json())
                .then(response => {
                    console.log(response.call_status);
                    if (response.call_status == 'DONE') {
                        document.getElementById("search").style.background = "#f44336";
                        document.getElementById("search").classList.remove("call-animation");
                        clearInterval(timer);
                    }
                });
        }, 2000);
    };

    changeScript = (id) => {
        fetch('http://127.0.0.1:8000/builder/getit/'+id)
            .then(res=>res.json())
            .then(data=>{
                this.setState({
                    sideJSON: data
                });
                console.log('are bhai bhai', data);
                var str = JSON.stringify(data['script_flow']);
                console.log(str)
                console.log(JSON.parse(str));
                var model2 = new DiagramModel();
                console.log(data['script_flow']);
                console.log(model2.deSerializeDiagram(JSON.parse(str), this.engine));
                console.log(model2);
                this.engine.setDiagramModel(model2);
                // this.engine.repaintCanvas();
                console.log(this.engine.getDiagramModel());
            });
    };

    render() {
        return (
            <div>
                <div className={"fixedGenerate"}>
                    <div
                        id="modal1"
                        className="modal">
                        {/* If you want Bottom Sheet Modal then add
        bottom-sheet class */}
                        <div className="modal-content">
                            <h4>Modal Header</h4>
                            <div className="input-field col s6">
                                <input placeholder="Enter your question" id="question_text" type="text" className="validate" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a href="#" className="modal-close waves-effect waves-green btn-flat" onClick={() => { this.handleInput()}}>
                                Submit
                            </a>
                        </div>
                    </div>
                    <div className={"call-button"}>
                        <CallButton handleInput={this.callHandleInput} callPhone={this.callPhone}/>
                    </div>
                    <a className="waves-effect btn-large" id={"generate-button"}
                       onClick={() => { this.generateJson()}}
                        style={{backgroundColor: "#393939"}}>
                        {this.state.isLoading ? <div className="progress button-progress">
                            <div className="indeterminate"></div>
                        </div> : null }
                        <i className="material-icons right">cloud</i>Generate</a>
                </div>
                <div className="content">
                    <Sidebar changeScript={this.changeScript}/>
                    <div
                        className="diagram-layer"
                        onDrop={event => {
                            console.log('NODE ADDED');
                            var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
                            var nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
                            var node = null;
                            if (data.type === 'in') {
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'peru');
                                node.addPort(new DefaultPortModel(true, 'in-1', 'In'));
                            } else if (data.type === 'out'){
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'hotpink');
                                node.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
                            } else {
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'hotpink');
                                node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));
                            }
                            var points = this.engine.getRelativeMousePoint(event);
                            node.x = points.x;
                            node.y = points.y;
                            this.engine.getDiagramModel().addNode(node);
                            console.log('orginal', this.engine.getDiagramModel().serializeDiagram());
                            this.forceUpdate();
                        }}
                        id={"node-" + Lodash.keys(this.engine.getDiagramModel().getNodes()).length + 1}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                        onDoubleClick={(e) => {
                            console.log(Lodash.keys(this.engine.getDiagramModel().getNodes()).length);
                            // var person = prompt("Please enter your name", "Harry Potter");
                            const iid = e.target.offsetParent.attributes[1].nodeValue;
                            this.setState({
                                iid: iid,
                                engine: this.engine
                            }, () => {
                                let elem = document.getElementById('modal1');
                                var instance = M.Modal.getInstance(elem);
                                instance.open();
                                document.getElementById('question_text').focus();
                            });






                            // let iid = this.engine.getDiagramModel().serializeDiagram().nodes[0].id;



                            // this.engine.getDiagramModel().nodes[iid].name = person;
                            // this.engine.repaintCanvas();




                            // console.log(this.props);
                        }
                        }
                    >
                        <DiagramWidget className="srd-demo-canvas" diagramEngine={this.engine} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ScriptBuilder;

import React from 'react';
import Lodash from 'lodash';
import {
    DiagramWidget,
    DiagramEngine,
    DefaultNodeFactory,
    DefaultLinkFactory,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramModel,
} from 'storm-react-diagrams';

import { DiamondNodeModel } from "./diamond/DiamondNodeModel";
import { DiamondNodeFactory } from "./diamond/DiamondNodeFactory";
import { SimplePortFactory } from "./diamond/SimplePortFactory";
import { DiamondPortModel } from "./diamond/DiamondPortModel";
import { distributeElements } from "./dagre-utils";
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
        localStorageLoader: false,
    };

    componentWillMount() {
        this.engine = new DiagramEngine();
        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
        this.engine.installDefaultFactories();
        this.engine.registerPortFactory(new SimplePortFactory("diamond", config => new DiamondPortModel()));
        this.engine.registerNodeFactory(new DiamondNodeFactory());
        if (localStorage.getItem("script_flow")) {
            const localScriptFlow = JSON.parse(localStorage.getItem("script_flow"));
            var str = JSON.stringify(localScriptFlow[localScriptFlow.length - 1]);

            //!------------- DESERIALIZING ----------------

            var model2 = new DiagramModel();
            model2.deSerializeDiagram(JSON.parse(str), this.engine);
            this.engine.setDiagramModel(model2);
        }
    }

    // TODO: How stupid this function is, stop it, get some help!
    generateJson() {
        console.log(this.engine.getDiagramModel().serializeDiagram());
        this.setState({
            isLoading: true
        });
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

    getDistributedModel(engine, model) {
        const serialized = model.serializeDiagram();
        const distributedSerializedDiagram = distributeElements(serialized);

        //deserialize the model
        let deSerializedModel = new DiagramModel();
        deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
        return deSerializedModel;
    }

    autoDistribute() {
        const model = this.engine.getDiagramModel();
        //let distributedModel = this.getDistributedModel(this.engine, model);
        this.engine.setDiagramModel(model);
        this.forceUpdate();
    }

    refreshModel() {
        var str = JSON.stringify(this.engine.getDiagramModel().serializeDiagram());

        //!------------- DESERIALIZING ----------------

        var model2 = new DiagramModel();
        model2.deSerializeDiagram(JSON.parse(str), this.engine);
        this.engine.setDiagramModel(model2);
    }

    saveScriptFlow() {
        this.setState({"localStorageLoader": true});
        let localScriptFlow = localStorage.getItem("script_flow");
        console.log('Local Storage =', localScriptFlow);
        if (!localScriptFlow) {
            localStorage.setItem("script_flow", JSON.stringify([]));
            setTimeout(() => { this.setState({"localStorageLoader": false}); }, 3000);
            return
        }
        localScriptFlow = JSON.parse(localScriptFlow);
        if (localScriptFlow.length > 50) {
            localScriptFlow.shift();
        }
        localScriptFlow.push(this.engine.getDiagramModel().serializeDiagram());
        localStorage.setItem("script_flow", JSON.stringify(localScriptFlow));
        setTimeout(() => { this.setState({"localStorageLoader": false}); }, 3000);
    }

    callHandleInput = (e) => {
        this.setState({
            callButtonValue: e.target.value
        })
    };

    callPhone = () => {
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
                var str = JSON.stringify(data['script_flow']);
                console.log(str);
                let model2 = new DiagramModel();
                let obj = JSON.parse(str);
                let node = obj.nodes[0];
                node.x += 30;
                node.y += 30;
                model2.deSerializeDiagram(obj, this.engine);
                this.engine.setDiagramModel(model2);
                this.forceUpdate();
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
                {(this.state.localStorageLoader) ? <div className={"fixedLoader"} id={"localStorageLoader"}>
                    <div className={"loadingspinner"}></div>
                </div> : null}
                <div className="content">
                    <Sidebar changeScript={this.changeScript}/>
                    <div
                        className="diagram-layer"
                        onDrop={event => {
                            var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
                            var nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
                            var node = null;
                            var points = this.engine.getRelativeMousePoint(event);
                            if (data.type === 'in') {
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'peru');
                                node.addPort(new DefaultPortModel(true, 'in-1', 'In'));
                            } else if (data.type === 'out'){
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'hotpink');
                                node.addPort(new DefaultPortModel(false, 'out-1', 'Out'));
                            } else if (data.type === 'out-in') {
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'hotpink');
                                node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));
                            } else {
                                // Diamond node created
                                node = new DiamondNodeModel();

                                // If True then follow this node
                                var condition_true_node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'green');
                                condition_true_node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                condition_true_node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));

                                // If False then
                                var condition_false_node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'red');
                                condition_false_node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                condition_false_node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));

                                // Neither true nor False then
                                var condition_neutral_node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'yellow');
                                condition_neutral_node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                condition_neutral_node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));


                                // Now attach these loosed nodes with diamond
                                const true_link = condition_true_node.getInPorts()[0].link(node.getPort("bottom"));
                                const false_link = condition_false_node.getInPorts()[0].link(node.getPort("top"));
                                const neutral_link = condition_neutral_node.getInPorts()[0].link(node.getPort("right"));

                                // Now set these loosed nodes some position
                                node.x = points.x;
                                node.y = points.y;

                                condition_true_node.x = points.x + 150;
                                condition_true_node.y = points.y + 150;

                                condition_false_node.x = points.x + 150;
                                condition_false_node.y = points.y - 80;

                                condition_neutral_node.x = points.x + 200;
                                condition_neutral_node.y = points.y + 37;

                                // Add them in our model
                                this.engine.getDiagramModel().addNode(node);
                                this.engine.getDiagramModel().addNode(condition_true_node);
                                this.engine.getDiagramModel().addNode(condition_false_node);
                                this.engine.getDiagramModel().addNode(condition_neutral_node);

                                this.engine.getDiagramModel().addLink(true_link);
                                this.engine.getDiagramModel().addLink(false_link);
                                this.engine.getDiagramModel().addLink(neutral_link);

                                // Without refreshing, the link was getting generated at top left and if we
                                // click on canvas then only the link get attached with nodes
                                // so it's better if we refresh the model
                                this.refreshModel();
                            }

                            if (data.type !== 'diamond') {
                                node.x = points.x;
                                node.y = points.y;
                                this.engine.getDiagramModel().addNode(node);
                                console.log('orginal', this.engine.getDiagramModel().serializeDiagram());
                            }
                            this.forceUpdate();
                            this.saveScriptFlow();
                        }}
                        id={"node-" + Lodash.keys(this.engine.getDiagramModel().getNodes()).length + 1}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                        onDoubleClick={(e) => {
                            // var person = prompt("Please enter your name", "Harry Potter");
                            const iid = e.target.offsetParent.attributes[1].nodeValue;
                            this.setState({
                                iid: iid,
                                engine: this.engine
                            }, () => {
                                let elem = document.getElementById('modal1');
                                console.log(elem);
                                var instance = M.Modal.getInstance(elem);
                                console.log(instance);
                                instance.open();
                                document.getElementById('question_text').focus();
                            });

                        }
                        }
                    >
                        <DiagramWidget className="srd-demo-canvas" smartRouting={true} diagramEngine={this.engine} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ScriptBuilder;

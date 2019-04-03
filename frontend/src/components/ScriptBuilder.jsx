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

import {DiamondNodeModel} from "./diamond/DiamondNodeModel";
import {DiamondNodeFactory} from "./diamond/DiamondNodeFactory";
import {SimplePortFactory} from "./diamond/SimplePortFactory";
import {DiamondPortModel} from "./diamond/DiamondPortModel";
import {distributeElements} from "./dagre-utils";
import 'storm-react-diagrams/dist/style.min.css';
import './srd.css';
import Sidebar from './Sidebar'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import CallButton from "./CallButton";
import {config} from '../resources/config';
import noUiSlider from 'nouislider/distribute/nouislider';
import 'nouislider/distribute/nouislider.css';
import wNumb from 'wnumb/wNumb';

const ShareToast = '<textarea style="font-size:12px;color: white" rows="8" cols="40" id="textarea2" class="materialize-textarea" data-length="120">' +
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
        redoStack: [],
    };

    componentWillMount() {
        // Event listener for any key stroke pressed
        document.addEventListener('keydown', this.keyPressHandler);

        // Script Builder initialized with default settings
        this.engine = new DiagramEngine();
        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
        this.engine.installDefaultFactories();

        // Custom Diamond node for optional conditions
        this.engine.registerPortFactory(new SimplePortFactory("diamond", () => {
            return new DiamondPortModel();
        }));
        this.engine.registerNodeFactory(new DiamondNodeFactory());

        // Load locally saved data from localStorage
        const localScriptFlow = JSON.parse(localStorage.getItem("script_flow"));
        if (localScriptFlow && localScriptFlow.length > 0) {
            const str = JSON.stringify(localScriptFlow[localScriptFlow.length - 1]);
            const custom_model = new DiagramModel();
            custom_model.deSerializeDiagram(JSON.parse(str), this.engine);
            this.engine.setDiagramModel(custom_model);
        }
    }

    componentDidMount() {
        const slider = document.getElementById('record-time');
        noUiSlider.create(slider, {
            start: [1, 10],
            connect: true,
            step: 1,
            orientation: 'horizontal', // 'horizontal' or 'vertical'
            range: {
                'min': 1,
                'max': 10
            },   format: wNumb({
                decimals: 0
            })

        });

        // Thanks to https://github.com/Dogfalo/materialize/issues/6036#issuecomment-409690482
        // Before this the slider was not showing any numerical tooltip
        const array_of_dom_elements = document.querySelectorAll("input[type=range]");
        M.Range.init(array_of_dom_elements);
    }

    componentWillUnmount() {
        // Remove Event Listener once in different component
        document.removeEventListener('keydown', this.keyPressHandler);
    }

    // TODO: How stupid this function is, stop it, get some help!
    generateJson() {
        this.setState({
            isLoading: true
        });

        // Upload JSON to get it saved
        fetch(config.API_URL + '/builder/upload/', {
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
                    if (response.status === 500) {
                        return ''
                    } else {
                        this.setState({
                            surveyId: response.id
                        })
                    }
                },
                (error) => {
                    M.toast({html: error});
                });
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
            if (this.state.surveyId !== '') {
                document.getElementById("generate-button").style.backgroundColor = "#4caf50";
                M.toast({html: ShareToast});
            } else {
                document.getElementById("generate-button").style.backgroundColor = "#f44336";
            }
        }, 3000);
    }

    // TODO: Customize input css with multiple input, save it in nodes.extras
    handleInput() {
        const iid = this.state.iid;
        let engineState = this.state.engine.getDiagramModel().serializeDiagram();
        if (!engineState.nodes.hasOwnProperty(iid)) {
            setTimeout(() => {
                engineState = this.engine.getDiagramModel().serializeDiagram();
                this.engine.getDiagramModel().nodes[iid].name = document.getElementById('question_text').value;
                document.getElementById('question_text').value = '';
                this.engine.repaintCanvas();
                console.log(this.engine.getDiagramModel().serializeDiagram());
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

        let deSerializedModel = new DiagramModel();
        deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
        return deSerializedModel;
    }

    autoDistribute() {
        const model = this.engine.getDiagramModel();
        let distributedModel = this.getDistributedModel(this.engine, model);
        this.engine.setDiagramModel(distributedModel);
        this.forceUpdate();
    }

    refreshModel() {
        const str = JSON.stringify(this.engine.getDiagramModel().serializeDiagram());

        const custom_model = new DiagramModel();
        custom_model.deSerializeDiagram(JSON.parse(str), this.engine);
        this.engine.setDiagramModel(custom_model);
    }

    undoHandler() {
        const currentStack = this.state.redoStack;
        const localScriptFlow = JSON.parse(localStorage.getItem("script_flow"));
        console.log(localScriptFlow);
        currentStack.push(localScriptFlow.pop());
        this.setState({
            redoStack: currentStack
        });
        localStorage.setItem("script_flow", JSON.stringify(localScriptFlow));

        // TODO: At last undo, delete everything
        if (localScriptFlow.length > 0) {
            const str = JSON.stringify(localScriptFlow[localScriptFlow.length - 1]);

            const custom_model = new DiagramModel();
            custom_model.deSerializeDiagram(JSON.parse(str), this.engine);
            this.engine.setDiagramModel(custom_model);
            this.forceUpdate();
        }
    }

    // Arrow function because with normal function we were not able to access undoHandler, fascinating
    keyPressHandler = (e) => {
        if (e.keyCode === 90 && e.ctrlKey) {
            this.undoHandler();
        }
    };

    // Save Script JSON in localStorage as Array with JSON inside them with 50 as max length
    saveScriptFlow() {
        let localScriptFlow = localStorage.getItem("script_flow");
        if (!localScriptFlow) {
            localStorage.setItem("script_flow", JSON.stringify([]));
        }
        localScriptFlow = JSON.parse(localScriptFlow);
        const currentScriptFlow = this.engine.getDiagramModel().serializeDiagram();
        if (localScriptFlow.length > 0 &&
            localScriptFlow[localScriptFlow.length - 1].links.length === currentScriptFlow.links.length &&
            localScriptFlow[localScriptFlow.length - 1].nodes.length === currentScriptFlow.nodes.length) {
            console.log('Nothing');
            return ''
        } else {
            this.setState({"localStorageLoader": true});
        }
        if (localScriptFlow.length > 50) {
            localScriptFlow.shift();
        }
        localScriptFlow.push(currentScriptFlow);
        localStorage.setItem("script_flow", JSON.stringify(localScriptFlow));
        setTimeout(() => {
            this.setState({"localStorageLoader": false});
        }, 1200);
    }

    // Call Button input value to be saved in state
    callHandleInput = (e) => {
        this.setState({
            callButtonValue: e.target.value
        })
    };

    callPhone = () => {
        fetch(config.API_URL + '/autocall/call/', {
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
            }, (error) => {
                console.log('callPhone =', error);
            });

        const timer = setInterval(() => {
            fetch(config.API_URL + '/autocall/survey/responses/' + this.state.responseId, {
                method: 'GET'
            }).then(response => response.json())
                .then(response => {
                    console.log(response.call_status);
                    if (response.call_status === 'DONE') {
                        document.getElementById("search").style.background = "#f44336";
                        document.getElementById("search").classList.remove("call-animation");
                        clearInterval(timer);
                    }
                });
        }, 2000);
    };

    changeScript = (id) => {
        fetch(config.API_URL + '/builder/getit/' + id)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    sideJSON: data
                });
                const str = JSON.stringify(data['script_flow']);
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
                    <div>
                        <ul id="slide-out-right" className="sidenav right-side-nav" style={{padding: "20px"}}>
                            <li>
                                <div className="subheader" style={{}}>Question</div>
                                <input placeholder="Enter your question" id="question_text" type="text"
                                       className="validate"/>
                            </li>
                            <li>
                                <div className="subheader" style={{}}>Voice Gender</div>
                                <p>
                                    <label>
                                        <input name="voice" type="radio" checked/>
                                        <span>Male</span>
                                    </label>
                                    <label>
                                        <input name="voice" type="radio"/>
                                        <span>Female</span>
                                    </label>
                                </p>
                            </li>
                            <li>
                                <div className="subheader" style={{}}>Recording Time</div>
                                <p className="range-field">
                                    <input type="range" step="1" id="record-time" min="1" max="10"/>
                                </p>
                            </li>
                            <li>
                                <a href="#" className="modal-close waves-effect waves-green btn-flat" onClick={() => {
                                    this.handleInput()
                                }}>Submit</a>
                            </li>
                        </ul>
                    </div>


                    <div className={"call-button"}>
                        <CallButton handleInput={this.callHandleInput} callPhone={this.callPhone}/>
                    </div>
                    <a className="waves-effect btn-large" id={"generate-button"}
                       onClick={() => {
                           this.generateJson()
                       }}
                       style={{backgroundColor: "#393939"}}>
                        {this.state.isLoading ? <div className="progress button-progress">
                            <div className="indeterminate"></div>
                        </div> : null}
                        <i className="material-icons right">cloud</i>Generate</a>
                </div>
                {(this.state.localStorageLoader) ? <div className={"fixedLoader"} id={"localStorageLoader"}>
                    <div className={"loadingspinner"}></div>
                </div> : null}
                <div className="content">
                    <Sidebar changeScript={this.changeScript}/>
                    <div
                        className="diagram-layer"
                        onMouseUp={event => {
                            this.saveScriptFlow();
                        }}
                        onDrop={event => {
                            const data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
                            const nodesCount = Lodash.keys(this.engine.getDiagramModel().getNodes()).length;
                            let node = null;
                            const points = this.engine.getRelativeMousePoint(event);
                            if (data.type === 'in') {
                                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'peru');
                                node.addPort(new DefaultPortModel(true, 'in-1', 'In'));
                            } else if (data.type === 'out') {
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
                                const condition_true_node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'green');
                                condition_true_node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                condition_true_node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));

                                // If False then
                                const condition_false_node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'red');
                                condition_false_node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                condition_false_node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));

                                // Neither true nor False then
                                const condition_neutral_node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'yellow');
                                condition_neutral_node.addPort(new DefaultPortModel(false, 'out-in-11', 'In'));
                                condition_neutral_node.addPort(new DefaultPortModel(true, 'out-in-12', 'Out'));


                                // Now attach these loosed nodes with diamond
                                const true_link = condition_true_node.getInPorts()[0].link(node.getPort("bottom"));
                                true_link.addLabel("True");
                                const false_link = condition_false_node.getInPorts()[0].link(node.getPort("top"));
                                false_link.addLabel("False");
                                const neutral_link = condition_neutral_node.getInPorts()[0].link(node.getPort("right"));
                                neutral_link.addLabel("Neutral");

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
                            }
                            this.saveScriptFlow();
                            this.forceUpdate();
                        }}
                        id={"node-" + Lodash.keys(this.engine.getDiagramModel().getNodes()).length + 1}
                        onDragOver={event => {
                            event.preventDefault();
                        }}
                        // Such a pain to do it, Double click on node and then enter question name
                        // TODO: Change the modal to toast if possible maybe
                        // TODO: Don't allow double click for diamond
                        onDoubleClick={
                            (e) => {
                                if (e.target.offsetParent.attributes[1]) {
                                    const iid = e.target.offsetParent.attributes[1].nodeValue;
                                    this.setState({
                                        iid: iid,
                                        engine: this.engine
                                    }, () => {
                                        const elem = document.querySelector(".right-side-nav");
                                        const instance = M.Sidenav.init(elem, {
                                            edge: "right",
                                            menuWidth: 400,
                                        });
                                        instance.open();
                                        document.getElementById('question_text').focus();
                                    });
                                }
                            }
                        }
                    >
                        <DiagramWidget className="srd-demo-canvas" smartRouting={true} diagramEngine={this.engine}
                                       maxNumberPointsPerLink={0}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScriptBuilder;

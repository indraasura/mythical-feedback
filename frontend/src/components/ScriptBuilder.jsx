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
import noUiSlider from 'nouislider';
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
        iid: '',                    // On node double click, save that iid
        isLoading: false,           // While generating the flow show loading
        callButtonValue: '',        // Call Button phone number saved here
        surveyId: 0,                // Unique id for that particular survey
        engine: '',                 // Engine used for react-storm TODO: Remove it
        responseId: '',             // Call response id used
        localStorageLoader: false,  // If local storage is used or not
        redoStack: [],              // On Undo, push the changes in redoStack
        scriptCheck: false,         // Script Validity
        callTime: '0 sec',          // Estimated call time
        documentName: '',           // Name of the document which you are working on
        restoreState: false,        // Flag to tell whether we can restore or not
        saveColor: '#393939',       // Color based on whether it is saved or not
        resetState: false           // Reset whole document with new start
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
            this.setState({
                restoreState: true
            })
        }
    }

    componentDidMount() {
        const slider = document.getElementById('record-time');
        noUiSlider.create(slider, {
            start: 2,
            connect: true,
            step: 5,
            orientation: 'horizontal', // 'horizontal' or 'vertical'
            range: {
                'min': 1,
                'max': 100
            }, format: wNumb({
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

    resetDocument() {
        const custom_model = new DiagramModel();
        custom_model.deSerializeDiagram(JSON.parse('{}'), this.engine);
        this.engine.setDiagramModel(custom_model);
        this.forceUpdate();
        this.setState({
            callButtonValue: '',
            surveyId: 0,
            responseId: '',
            redoStack: [],
            scriptCheck: false,
            callTime: '0 sec',
            documentName: '',
            saveColor: '#393939',
            resetState: false,

        });

        this.closeRestoreCard();
    }

    closeRestoreCard() {
        this.setState({
            restoreState: false
        });
        localStorage.removeItem('script_flow');
        localStorage.removeItem('document_name');
        localStorage.removeItem('document_id');
    }

    loadLocalStorage() {
        console.log('YES');
        const localScriptFlow = JSON.parse(localStorage.getItem("script_flow"));
        const document_name = localStorage.getItem("document_name");
        const document_id = localStorage.getItem("document_id");
        if (localScriptFlow && localScriptFlow.length > 0) {
            const str = JSON.stringify(localScriptFlow[localScriptFlow.length - 1]);
            const custom_model = new DiagramModel();
            custom_model.deSerializeDiagram(JSON.parse(str), this.engine);
            this.engine.setDiagramModel(custom_model);
            this.calculateCallTime();
            this.forceUpdate();
        }

        if (document_name) {
            this.setState({
                documentName: document_name
            })
        }
        if (document_id && document_id !== "0") {
            console.log('documentid', document_id)
            this.setState({
                saveColor: '#df9300',
                surveyId: parseInt(document_id)
            });
        }
        this.setState({
            restoreState: false
        });
    }

    // TODO: Breaks in cased of conditional case
    calculateCallTime() {
        let total_word = 0;
        let total_response = 0;
        let final_time = 0;
        const temp_model = this.engine.getDiagramModel().serializeDiagram();
        for (let i = 0; i < temp_model.nodes.length; i++) {
            total_word += temp_model.nodes[i].name.split(' ').length;
            if (temp_model.nodes[i].extras['record_time']) {
                total_response += parseInt(temp_model.nodes[i].extras['record_time']);
            } else {
                total_response += 2;
            }
        }
        console.log('totoal_word', total_word);
        console.log('total_response', total_response);
        let call_time = Math.round(total_word / 1.5) + total_response;
        if (call_time > 60) {
            final_time = Math.floor(call_time / 60) + ' min ' + (call_time % 60) + ' sec';
        } else {
            final_time = call_time + ' sec';
        }
        this.setState({
            callTime: final_time
        })
    }

    // TODO: How stupid this function is, stop it, get some help!
    generateJson() {
        if (this.state.documentName === '') {
            M.toast({html: 'Document name not specified'}, 1000);
            return
        }

        console.log(this.engine.getDiagramModel().serializeDiagram());
        this.setState({
            isLoading: true,
        });
        console.log('surveyID', this.state.surveyId)
        if (this.state.surveyId === 0) {
            // Upload JSON to get it saved
            fetch(config.API_URL + '/builder/upload/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.documentName,
                    script_flow: this.engine.getDiagramModel().serializeDiagram(),
                })
            }).then(response => response.json())
                .then(response => {
                        console.log(response);
                        if (!response.script_status) {
                            this.setState({
                                scriptCheck: false
                            });
                            M.toast({html: response.script_message});
                        } else {
                            this.setState({
                                surveyId: response.id,
                                scriptCheck: true
                            });
                            localStorage.setItem('document_id', response.id);
                        }
                    },
                    (error) => {
                        M.toast({html: "Unexpected Error"});
                    });
        } else {
            // Update JSON to get it saved
            fetch(config.API_URL + '/builder/getit/' + this.state.surveyId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.documentName,
                    script_flow: this.engine.getDiagramModel().serializeDiagram(),
                })
            }).then(response => response.json())
                .then(response => {
                        console.log(response);
                        if (!response.script_status) {
                            this.setState({
                                scriptCheck: false
                            });
                            M.toast({html: response.script_message});
                        } else {
                            this.setState({
                                surveyId: response.id,
                                scriptCheck: true
                            })
                        }
                    },
                    (error) => {
                        M.toast({html: "Unexpected Error"});
                    });
        }

        setTimeout(() => {
            this.setState({
                isLoading: false
            });
            if (this.state.scriptCheck) {
                this.setState({
                    saveColor: "#4caf50"
                });
                // TODO: Make sharable plugin in sidenav
                // M.toast({html: ShareToast});
            } else {
                this.setState({
                    saveColor: "#f44336"
                });
            }
        }, 1000);
    }

    // TODO: Customize input css with multiple input, save it in nodes.extras
    handleInput() {
        const iid = this.state.iid;
        let engineState = this.state.engine.getDiagramModel().serializeDiagram();
        console.log(document.querySelector('input[name="voice"]:checked').value);
        console.log(document.getElementById('record-time').value);
        if (!engineState.nodes.hasOwnProperty(iid)) {
            setTimeout(() => {
                engineState = this.engine.getDiagramModel().serializeDiagram();
                this.engine.getDiagramModel().nodes[iid].name = document.getElementById('question_text').value;
                this.engine.getDiagramModel().nodes[iid]['extras']['record_time'] = document.getElementById('record-time').value;
                this.engine.getDiagramModel().nodes[iid]['extras']['voice_gender'] = document.querySelector('input[name="voice"]:checked').value;
                document.getElementById('question_text').value = '';
                document.getElementById('record-time').value = 2;
                document.getElementById('male_voice').checked = false;
                document.getElementById('female_voice').checked = false;

                this.engine.repaintCanvas();
                console.log(this.engine.getDiagramModel().serializeDiagram());
                this.saveScriptFlow();
            }, 200)
        } else {
            this.engine.getDiagramModel().nodes[iid].name = document.getElementById('question_text').value;
            this.engine.getDiagramModel().nodes[iid]['extras']['record_time'] = document.getElementById('record-time').value;
            this.engine.getDiagramModel().nodes[iid]['extras']['voice_gender'] = document.querySelector('input[name="voice"]:checked').value;
            document.getElementById('question_text').value = '';
            document.getElementById('record-time').value = 2;
            document.getElementById('male_voice').checked = false;
            document.getElementById('female_voice').checked = false;

            this.engine.repaintCanvas();
            this.saveScriptFlow();
        }

        const elem = document.querySelector(".right-side-nav");
        const instance = M.Sidenav.init(elem, {
            edge: "right",
            menuWidth: 400,
        });
        instance.close();
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
            localStorage.setItem("document_id", "0");
            localScriptFlow = '[]';
        }
        localScriptFlow = JSON.parse(localScriptFlow);
        const currentScriptFlow = this.engine.getDiagramModel().serializeDiagram();

        currentScriptFlow.offsetX = 0;
        currentScriptFlow.offsetY = 0;
        currentScriptFlow.zoom = 100;
        currentScriptFlow.gridSize = 0;

        for (let i = 0; i < currentScriptFlow.nodes.length; i++) {
            currentScriptFlow.nodes[i].selected = false;
        }
        for (let i = 0; i < currentScriptFlow.links.length; i++) {
            currentScriptFlow.links[i].selected = false;
        }

        console.log(currentScriptFlow, JSON.stringify(localScriptFlow[localScriptFlow.length - 1]) === JSON.stringify(currentScriptFlow));
        if (JSON.stringify(localScriptFlow[localScriptFlow.length - 1]) === JSON.stringify(currentScriptFlow) ||
            currentScriptFlow.nodes.length === 0) {
            console.log('Nothing');
            return ''
        } else {
            if (this.state.surveyId !== 0) {
                this.setState({
                    saveColor: '#df9300'
                });
            }
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
        this.calculateCallTime();
    }

    // Call Button input value to be saved in state
    callHandleInput = (e) => {
        this.setState({
            callButtonValue: e.target.value
        })
    };

    documentHandleInput = (e) => {
        this.setState({
            documentName: e.target.value
        });
        localStorage.setItem('document_name', e.target.value);
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

        // TODO: Work on this issue
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

    resetHandler = () => {
        this.setState({
            resetState: true,
        })
    }

    render() {
        return (
            <div>
                <div className={"fixedGenerate"}>

                    {(this.state.resetState) ?
                        <>
                            <div className="sidenav-overlay" style={{display: "block", opacity: 1, zIndex: 2}}></div>
                            <div className="show" id={"custom-toast"}>
                                <span>Are you sure ?</span>
                                <button className="btn-flat toast-action orange-text"
                                        style={{marginleft: "5px"}}
                                        onClick={() => {
                                            this.resetDocument()
                                        }}>Yes
                                </button>
                                <span style={{cursor: "pointer"}} onClick={() => {
                                this.setState({
                                    resetState: false,
                                })}}><i className="material-icons restore-close-button white-text"
                                      style={{marginLeft: "0px", position: "absolute"}}>close</i></span>
                            </div>
                        </>
                        : null}
                    {(this.state.restoreState) ?
                        <>
                            <div className="sidenav-overlay" style={{display: "block", opacity: 1, zIndex: 2}}></div>
                            <div className="show" id={"custom-toast"}>
                                <span>Previous Session Found</span>
                                <button className="btn-flat toast-action orange-text"
                                        style={{marginleft: "5px"}}
                                        onClick={() => {
                                            this.loadLocalStorage()
                                        }}>Restore
                                </button>
                                <span style={{cursor: "pointer"}} onClick={() => {
                                    this.closeRestoreCard()
                                }}><i className="material-icons restore-close-button white-text"
                                      style={{marginLeft: "0px", position: "absolute"}}>close</i></span>
                            </div>
                        </>
                        : null}
                    <div>
                        <ul id="slide-out-right" className="sidenav right-side-nav" style={{padding: "20px"}}>
                            <li>
                                <div className="subheader" style={{}}>Question</div>
                                <input placeholder="Enter your question" id="question_text" type="text"
                                       className="validate"/>
                            </li>
                            <li>
                                <div className="subheader" style={{}}>Voice Gender</div>
                                <p id={"call-voice"}>
                                    <label>
                                        <input name="voice" type="radio" value={"male"} id="male_voice"/>
                                        <span>Male</span>
                                    </label>
                                    <label>
                                        <input name="voice" type="radio" value={"female"} id="female_voice"/>
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
                    <a className="btn-large" id={"generate-button"}
                       onClick={() => {
                           this.generateJson()
                       }}
                       style={{backgroundColor: this.state.saveColor}}>
                        {this.state.isLoading ? <div className="progress button-progress">
                            <div className="indeterminate"></div>
                        </div> : null}
                        <i className="material-icons right">cloud</i>Generate
                    </a><br/>
                    <div className={"call-time tooltipped"} data-position="bottom" data-tooltip="Estimated call time">
                        <i className="material-icons call-time-icon">access_time</i>{this.state.callTime}
                    </div>
                </div>
                {(this.state.localStorageLoader) ? <div className={"fixedLoader"} id={"localStorageLoader"}>
                    <div className={"loadingspinner"}></div>
                </div> : null}
                <div className="content">
                    <Sidebar documentName={this.state.documentName} changeScript={this.changeScript}
                             documentHandleInput={this.documentHandleInput}
                             resetHandler={this.resetHandler} />
                    <div
                        className="diagram-layer"
                        onKeyDown={e => {
                            console.log(e.key);
                            if (e.key === 'Delete') {
                                // Save after few milliseconds once the json is updated, when we delete the node
                                setTimeout(() => {
                                    this.saveScriptFlow();
                                }, 100);
                            }
                        }}
                        // To be able to track the key pressed we need tabIndex=0
                        tabIndex="0"
                        onMouseUp={event => {

                            // #30: Without set timeout, links were not getting updated in diagram json due to which
                            // in local storage the target node is null by default
                            // Keeping it 0 make sure that json gets updated and then serialized diagram json
                            // will get save in local storage
                            setTimeout(() => {
                                this.saveScriptFlow();
                            }, 0);
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

                            const node_json = node.serialize();
                            node_json.extras['node_type'] = data.type;
                            node.deSerialize(node_json, this.engine);

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
                                if (e.target.offsetParent && e.target.offsetParent.attributes[1]) {
                                    const iid = e.target.offsetParent.attributes[1].nodeValue;
                                    this.setState({
                                        iid: iid,
                                        engine: this.engine
                                    }, () => {
                                        const temp_model = this.engine.getDiagramModel();
                                        document.getElementById('question_text').value = temp_model.nodes[iid].name;
                                        if (temp_model.nodes[iid]['extras']['record_time']) {
                                            document.getElementById('record-time').value = temp_model.nodes[iid]['extras']['record_time'];
                                        } else {
                                            document.getElementById('record-time').value = 2;
                                        }
                                        if (temp_model.nodes[iid]['extras']['voice_gender']) {
                                            const radiobtn = document.getElementById(temp_model.nodes[iid]['extras']['voice_gender'] + '_voice');
                                            radiobtn.checked = true;
                                        } else {
                                            const radiobtn = document.getElementById('male_voice');
                                            radiobtn.checked = true;
                                        }
                                        document.getElementById('question_text').focus();
                                        const elem = document.querySelector(".right-side-nav");
                                        const instance = M.Sidenav.init(elem, {
                                            edge: "right",
                                            menuWidth: 400,
                                        });
                                        instance.open();
                                    });
                                }
                            }
                        }
                    >
                        <DiagramWidget className="srd-demo-canvas"
                                       diagramEngine={this.engine}
                                       smartRouting={true}        // Sharp edges rather than smooth curves
                                       maxNumberPointsPerLink={0} // Points which breaks the line into 2
                                       allowLooseLinks={false}    // No loose links without connection
                                       deleteKeys={[46]}          // Avoid backspace deleting node while typing question
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ScriptBuilder;

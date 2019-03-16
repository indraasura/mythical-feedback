import React from 'react';
import Lodash from 'lodash';
import {
    DiagramWidget,
    DiagramEngine,
    DefaultNodeFactory,
    DefaultLinkFactory,
    DefaultNodeModel,
    DefaultPortModel,
} from 'storm-react-diagrams';
import 'storm-react-diagrams/dist/style.min.css';
import './srd.css';
import Sidebar from './Sidebar'
// import Modal from "./Modal";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

const Modal = props => (
    <>

    </>
);

class ScriptBuilder extends React.Component {
    static defaultProps = {
        node: null
    };
    state = {
        input_text: '',
        iid: '',
    }
    engine = new DiagramEngine();

    componentWillMount() {
        this.engine.registerNodeFactory(new DefaultNodeFactory());
        this.engine.registerLinkFactory(new DefaultLinkFactory());
    }

    generateJson() {
        console.log(this.engine.getDiagramModel().serializeDiagram());
    }

    handleInput() {
        // let iid = this.engine.getDiagramModel().serializeDiagram().nodes[0].id;
        const iid = this.state.iid;
        this.engine.getDiagramModel().nodes[iid].name = document.getElementById('question_text').value;
        document.getElementById('question_text').value = '';
        this.engine.repaintCanvas();
    }

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
                    <a className="waves-effect waves-light btn-large"
                       onClick={() => { this.generateJson()}}><i className="material-icons right">cloud</i>Generate</a>
                </div>
                <div className="content">
                    <Sidebar />
                    <div
                        className="diagram-layer"
                        onDrop={event => {
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
                            console.log(this.engine.getDiagramModel().serializeDiagram());
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
                            });




                            let elem = document.getElementById('modal1');
                            var instance = M.Modal.getInstance(elem);
                            instance.open();
                            document.getElementById('question_text').focus();

                            // let iid = this.engine.getDiagramModel().serializeDiagram().nodes[0].id;



                            // this.engine.getDiagramModel().nodes[iid].name = person;
                            // this.engine.repaintCanvas();




                            // console.log(this.props);
                        }
                        }
                    >
                        <DiagramWidget diagramEngine={this.engine} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ScriptBuilder;

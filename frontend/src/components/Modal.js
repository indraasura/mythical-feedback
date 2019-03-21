import React, {Component} from "react";
import "materialize-css/dist/css/materialize.min.css";

class Modal extends Component {

    getInput() {
        console.log('Getting input');
        this.props.handleInput(document.getElementById("question_text").value);
    }

    render() {
        return (
            <>
                <div
                    ref={Modal => {
                        this.Modal = Modal;
                    }}
                    id="modal1"
                    className="modal"
                >
                    {/* If you want Bottom Sheet Modal then add
        bottom-sheet class */}
                    <div className="modal-content">
                        <h4>Enter your question</h4>
                        <div className="input-field col s6">
                            <input placeholder="Enter your question" id="question_text" type="text" className="validate" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <a href="#" className="modal-close waves-effect waves-green btn-flat" onClick={() => { this.getInput()}}>
                            Submit
                        </a>
                    </div>
                </div>
            </>
        );
    }
}

export default Modal;

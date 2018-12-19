import React from "react";
import FormContext from "../context";


class ValidateButton extends React.Component {
	static contextType = FormContext;
  constructor(props) {
    super(props);
    this.state = {
      submitting: false
    }
  }
  render() {
    /*
      STATUS (className)
    */
    var disable = "";
    if (this.props.if==="valid" && !this.context.formStatus.valid) {
      disable = " disable ";
    }
    if (this.props.if==="changed" && !this.context.formStatus.changed) {
      disable = " disable ";
    }
    if (this.context.submitting) {
      disable = " disable ";
    }
    /*
      VIEW (wrapper div, status text)
    */
    return (
      <div 
        className={ "ValidateButton" + disable } 
        onClick={(e)=>{ 
          this.context.on_buttonClick(this.props.type);

          /*
            SUBMIT
          */
          if (this.props.type === "submit") {
            this.setState({submitting:true}); // 
          }

          /*
            ALWAYS (RESET)
          */
          if (!disable && this.props.onClick) { 
            this.props.onClick(this.context.formInitialValues); // send initial values ~ for custom use
          } 

        }}
      >
        {this.props.children}
      </div>
    )
  }
}

export default ValidateButton;
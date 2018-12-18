import React from "react";
import FormContext from "../context";


class ValidateButton extends React.Component {
	static contextType = FormContext;
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
    /*
      VIEW (wrapper div, status text)
    */
    return (
      <div 
        className={ "ValidateButton" + disable } 
        onClick={()=>{ 
          this.context.on_buttonClick(this.props.type);

          if (!disable && this.props.onClick) { 

            if (this.props.type==="reset") {
              this.props.onClick(this.context.formInitialValues); 
            } else {
              this.props.onClick(); 
            }

          } 

        }}
      >
        {this.props.children}
      </div>
    )
  }
}

export default ValidateButton;
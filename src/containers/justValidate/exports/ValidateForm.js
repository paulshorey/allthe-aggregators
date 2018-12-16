import React from "react";
import FormContext from "../context";
import "../style.scss";

class ValidateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      changed: false,
      setState: this.setState
    }
  }
  render() {
    return (
      <FormContext.Provider value={this.state}>
      	<div className="ValidateForm">
	        {this.props.children}
	      </div>
      </FormContext.Provider>
    )
  }
}

export default ValidateForm;


/*
{
	originalValues: {},
  valid: false,
  changed: false,
  onValidate: function(){
  },
  onChange: function(){
  }
}
*/
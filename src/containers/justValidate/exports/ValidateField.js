import React from "react";
import FormContext from "../context";


const validate = function(changed, props){
	let value = props.value;
	let validations = props.validations;
	let status = {
		changed: changed
	}
	validations.forEach(function(validation, v){
		if (status.invalid) {
			return;
		}
		status.invalid = validation(value);
	});
	return status;
};


class ValidateField extends React.Component {
	static contextType = FormContext;
	status = {};

	/*
		INITIAL VALUE
	*/
	componentDidMount() {
  	this.context.fieldInitialValue({[this.props.name]: this.props.value });
  	this.context.fieldStatus({[this.props.name]: validate(false, this.props) });
  }
	
	/*
		ON-CHANGE
	*/
  componentDidUpdate(){
		this.status = validate(true, this.props);
  	this.context.fieldStatus({[this.props.name]: this.status });
  }

	/*
		VIEW (wrapper, error text)
	*/
  render() {
    return (
      <fieldset className={ "ValidateField" + (this.status.invalid && " invalid ") }>
        {this.props.children}
        {this.status.invalid && <span className="ValidateStatus">{this.status.invalid}</span>}
      </fieldset>
    )

  }
}

export default ValidateField;
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
	constructor(props){
		super(props);
		this.status = {};
		this.value = props.value;
	}

	/*
		INITIAL VALUE
	*/
	componentDidMount() {
		this.value = this.props.value;
  	this.context.on_fieldInitialValue({[this.props.name]: this.props.value });
  	this.context.on_fieldStatusSet({[this.props.name]: validate(false, this.props) });
  }
	
	/*
		ON-CHANGE
	*/
  componentDidUpdate(){
		this.status = validate((this.value!=this.props.value), this.props);
  	this.context.on_fieldStatusUpdate({[this.props.name]: this.status });
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
import React from "react";
import FormContext from "../context";

const compareFormStatus = function(oldStatus, newStatus) {
  if (
    (oldStatus.changed!==newStatus.changed) || 
    (oldStatus.valid!==newStatus.valid) || 
    (oldStatus.submitAttempted!==newStatus.submitAttempted) || 
    (oldStatus.reset!==newStatus.reset)
  ) {
    return true;
  } else {
    return false;
  }
}
const generateFormStatus = function(thisFields) {
  let status = {
    changed: false,
    invalid: new Set([]),
    valid: true,
    submitAttempted: false,
    reset: false
  };
  for (let f in thisFields) {
    let field = thisFields[f];
    // changed
    if (field.changed) {
      status.changed = true;
    }
    // invalid
    if (field.invalid) {
      status.invalid.add(field.invalid);
    }
  }
  if (status.invalid.size) {
    status.valid = false;
  }
  return status;
}
// const compareFields = function(oldFields, newFields) {
//   for (let f in oldFields) {
//     let oldField = oldFields[f];
//     let newField = newFields[f];
//     if (typeof oldField === "object" || typeof oldField === "function") {
//       // ignore
//     } else {
//       // if boolean, number, or string, compare:
//       if (oldField !== newField) {
//         return false;
//       }
//     }
//   }
//   // survived this far! Means all is the same
//   return true;
// }

class ValidateForm extends React.Component {

  constructor(props){
    super(props);
    this.fields = {};
    this.formStatus = generateFormStatus(this.fields);
    this.formInitialValues = {};
  }

  on_fieldInitialValue = (field) => {
    this.formInitialValues = {...this.formInitialValues, ...field}
  };  
  on_fieldStatusSet = (field) => {   
    console.log('field set'); 
    // new form status
    this.fields = {...this.fields, ...field}
    this.formStatus = generateFormStatus(this.fields);
  };
  on_fieldStatusUpdate = (field) => {   
    console.log('field update');
    // new form status
    this.fields = {...this.fields, ...field}
    let status = generateFormStatus(this.fields);
    // compare to old form status
    if (compareFormStatus(this.formStatus, status)) {
      this.formStatus = status;
      this.forceUpdate();
    }
  };
  on_buttonClick = (actionAttempted) => {
    // new form status
    let status = generateFormStatus(this.fields);
    switch (actionAttempted) {
      case "submit":
        status.submitting = true;
        status.submitAttempted = true;
      break;
      case "reset":
        status.reset = true;
        status.changed = false;
      break;
      default:
      break;
    }
    // compare to old form status
    if (compareFormStatus(this.formStatus, status)) {
      this.formStatus = status;
      this.forceUpdate();
    }
  };
  on_submit = (event) => {
    event.preventDefault();

    // validate
    if (this.formStatus.valid) {
      this.props.onSubmit();
    }
  };

  render() {
    console.log('form status',this.formStatus);
    return (
      <FormContext.Provider value={{formStatus: this.formStatus, formInitialValues: this.formInitialValues, on_fieldInitialValue: this.on_fieldInitialValue, on_fieldStatusUpdate: this.on_fieldStatusUpdate, on_fieldStatusSet: this.on_fieldStatusSet, on_buttonClick: this.on_buttonClick}}>
        <form onSubmit={this.on_submit}>
        	<div className={"ValidateForm" + (this.formStatus.invalid.size && " invalid ")  }>
  	        {this.props.children}
  	      </div>
        </form>
      </FormContext.Provider>
    )
  }
}

export default ValidateForm;
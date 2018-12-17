import React from "react";
import FormContext from "../context";
import "../style.scss";
import '../lib/Object.prototype.watch';

class ValidateForm extends React.Component {

  formStatus = {
    changed: false,
    invalid: new Set([])
  }

  fieldInitialValue = {};
  fieldStatus = {};

  fieldInitialValue_update = (field) => {
    this.fields = {...this.fields, ...field}
  };
  
  fieldStatus_update = (field) => {
    console.log('field update');
    this.fields = {...this.fields, ...field}

    /*
      NEW state
    */
    let status = {
      changed: false,
      invalid: new Set([])
    };
    for (let f in this.fields) {
      let field = this.fields[f];
      // changed
      if (field.changed) {
        status.changed = true;
      }
      // invalid
      if (field.invalid) {
        status.invalid.add(field.invalid);
      }
    }
    /*
      COMPARE to old
    */
    if (
      (this.formStatus.changed!==status.changed) || 
      (this.formStatus.invalid.size!==status.invalid.size)
    ) { 
      console.warn('status',status);
      console.warn('this.formStatus',this.formStatus);
      this.formStatus = status;
      this.forceUpdate();
    }

  };

  componentDidUpdate(){
    console.log('form update');
  }

  render() {
    console.log('form render', this.fields);

    /*
      STATUS (className)
    */
    // this.formStatus = {
    //   changed: false,
    //   invalid: new Set([])
    // };
    // for (let f in this.fields) {
    //   let field = this.fields[f];
    //   // changed
    //   if (field.changed) {
    //     this.formStatus.changed = true;
    //   }
    //   // invalid
    //   if (field.invalid) {
    //     this.formStatus.invalid.add(field.invalid);
    //   }
    // }

    /*
      VIEW (wrapper div, status text)
    */
    return (
      <FormContext.Provider value={{formStatus: this.formStatus, fieldInitialValue: this.fieldInitialValue_update, fieldStatus: this.fieldStatus_update}}>
      	<div className={"ValidateForm" + (this.formStatus.invalid.size && " invalid ")  }>
	        {this.props.children}
	      </div>
      </FormContext.Provider>
    )
  }
}

export default ValidateForm;
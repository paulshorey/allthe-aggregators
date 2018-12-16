import React from "react";
import FormContext from "../context";


class ValidateField extends React.Component {
	static contextType = FormContext;
  render() {
    return (
      <div className="ValidateField">
        {this.props.children}
      </div>
    )
  }
}

export default ValidateField;
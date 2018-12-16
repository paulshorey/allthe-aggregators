import React from "react";
import FormContext from "../context";


class ValidateButton extends React.Component {
	static contextType = FormContext;
  render() {
    return (
      <div className="ValidateButton">
        {this.props.children}
      </div>
    )
  }
}

export default ValidateButton;
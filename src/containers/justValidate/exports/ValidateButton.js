import React from "react";
import FormContext from "../context";


class ValidateButton extends React.Component {
	static contextType = FormContext;
  render() {
    /*
      STATUS (className)
    */
    var addClass = "";
    // if (this.context.state.changed && !this.context.state.valid) {
    //   addClass = " invalid ";
    // }
    /*
      VIEW (wrapper div, status text)
    */
    return (
      <div className={ "ValidateButton" + addClass }>
        {this.props.children}
      </div>
    )
  }
}

export default ValidateButton;
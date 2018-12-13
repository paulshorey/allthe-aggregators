import React, { Component } from "react";

export default class extends Component {
  render() {
  	console.log('Edit.js',this.props);
    return (
      <div>
        <p>Edit sub-route...</p>
        <p>{this.props.match.params.uid}</p>
      </div>
    )
  }
}
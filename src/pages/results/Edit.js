import React, { Component } from "react";

export default class extends Component {
  render() {
  	console.log('Edit.js',this.props);
    return (
      <div>
        <p>Edit</p>
        <p>{this.props.match.params.uid}</p>
      </div>
    )
  }
}
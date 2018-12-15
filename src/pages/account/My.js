import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class ThisComponent extends Component {
  render() {
    return (
      this.props.account.data._id
      ?
      <div>
        <p>MyAccount</p>
        <ul>
          <li>{this.props.account.data._id}</li>
          <li>{this.props.account.data.email}</li>
        </ul>
      </div>
      :
      <Redirect to="/login" />
    )
  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account
  }
}
export default connect(mapStateToProps)(ThisComponent);
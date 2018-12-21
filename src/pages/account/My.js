import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import "./style/myaccount.scss";

class ThisComponent extends Component {
  render() {
    var AccountProps = [];
    for (let a in this.props.account) {
      AccountProps.push(<li><label>{a}:</label> <b>{this.props.account[a].toString()}</b></li>);
    }
    return (
      this.props.account._id
      ?
      <div className="MyAccount">
        <p>MyAccount</p>
        <ul>
          {AccountProps}
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
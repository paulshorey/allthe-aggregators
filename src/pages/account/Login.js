import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginForm from 'src/components/form/Login';

class ThisComponent extends React.Component {
  render() {
    return (
      !this.props.account._id
      ?
      <div>
        <p>Login</p>
        <LoginForm />
      </div>
      :
      <Redirect to="/account" />
    )
  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account
  }
}
export default connect(mapStateToProps)(ThisComponent);
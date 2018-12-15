import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RegisterForm from 'src/components/form/Register';

class ThisComponent extends React.Component {
  render() {
    return (
      !this.props.account._id
      ?
      <div>
        <p>Register</p>
        <RegisterForm />
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
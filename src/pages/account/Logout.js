import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class ThisComponent extends React.Component {
  componentWillMount(){
    this.props.dispatch(this.props.actions.RX_ACCOUNT_LOGOUT());
  }
  render() {
    return (
      !this.props.account._id
      ?
      <Redirect to="/login" />
      :
      <p>Logging out...</p>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account,
    actions: state.actions
  }
}
export default connect(mapStateToProps)(ThisComponent);
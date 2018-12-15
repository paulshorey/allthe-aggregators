import React from "react";
import { connect } from 'react-redux';

class ThisComponent extends React.Component {
  render() {
    return (
      <div>
        <p>Login</p>
        <input placeholder="email" type="text" value="" />
        <input placeholder="password" type="password" value="" />
        <button onClick={()=>{ 
        	
          this.props.dispatch(this.props.actions.RX_LOGIN({ "email": "ps@artspaces.net", "password": "demo" }));

        }}>
        	Submit
        </button>
      </div>
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
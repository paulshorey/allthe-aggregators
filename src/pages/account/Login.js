import React from "react";
import { connect } from 'react-redux';

class ThisComponent extends React.Component {
  render() {
    console.log('Login Component props',this.props);
    return (
      <div>
        <p>Login</p>
        <p onClick={()=>{ 
        	this.props.dispatch(this.props.actions.RX_LOGIN());
        }}>
        	Click me
        </p>
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
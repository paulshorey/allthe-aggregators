import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import "./Header.scss";

class ThisComponent extends React.Component {
  render() {
    var TopLinks = [];
    if (this.props.account._id) {
      // logged in links
      TopLinks.push(<span key={"adf"}><Link to={"/logout"}>Logout</Link></span>);
    } else {
      // logged out links
      TopLinks.push(<span key={"asdfl"}><Link to={"/login"}>Login</Link></span>);
    }
    return (
      <div className={this.props.className + " Header"}>
        <div className="--logo">
          <span><Link to="/account">Dashboard</Link></span>
        </div>
        <div className="--links">
          {TopLinks}
        </div>
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
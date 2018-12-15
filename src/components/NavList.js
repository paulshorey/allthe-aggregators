import React from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import "./NavList.scss";

class ThisComponent extends React.Component {
  render() {

    // helper function to build SubRoutes[] (first), and Route[] (last)
    var NavLink = (link) => {
      // list item selected || open the list if child is selected || keep children collapsed and do not select
      let selectedOpened = "";
      if (link.url == this.props.location.pathname) {
        selectedOpened += " selected ";
        if (link.subRoutes) {
          selectedOpened += " opened ";
        }
      }
      if (link.subRoutes) {
        let subRoutesMatached = link.subRoutes.filter(link => link.url == this.props.location.pathname);
        if (subRoutesMatached.length) {
          selectedOpened += " opened ";
        }
      }
      // render
      return (
        (
          (link.loggedIn === undefined)  ||  // link must be public, or user must be logged in
          (link.loggedIn === true && this.props.account._id) ||
          (link.loggedIn === false && !this.props.account._id)
        )
        ?
        <li key={link.url} className={selectedOpened}>
          <Link to={link.url}>{link.title}</Link>
          {SubRoutes}
        </li>
        :
        null
      )
    };

    // FIRST, render child routes, to build this variable, to be used by NavLink() to build primary route below
    var SubRoutes = (
      this.props.data.subRoutes
      ?
      <ul>
        {this.props.data.subRoutes.map(NavLink)}
      </ul>
      :
      null
    );

    // THEN, after child routes, render primary route
    var Route = (
      <ul className="NavList">
        {NavLink(this.props.data)}
      </ul>
    );

    return (
      // all these things must be true for the component to render:
      (
        (this.props.data && this.props.data.url) // must have data and url (otherwise it may be an Error route which doesn't have a <Link />)
        && 
        (
          (this.props.data.loggedIn === undefined)  ||  // link must be public, or user must be logged in
          (this.props.data.loggedIn === true && this.props.account._id) ||
          (this.props.data.loggedIn === false && !this.props.account._id)
        )
      )
      ?
      // success, render
      <div className={this.props.className + " NavList"}>
        {Route}
      </div>
      :
      // fail, render alternative
      null
    );

  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account
  }
}
export default connect(mapStateToProps)(ThisComponent);
import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import Async from 'react-code-splitting';

/*
  Routes
*/
var routes = [
  {
    url: "/account/login",
    component: function() {
      return require('src/pages/account/Login').default;
    },
  },
  {
    url: "/account/register",
    component: function() {
      return require('src/pages/account/Register').default;
    },
  },
  {
    url: "/account/password",
    component: function() {
      return require('src/pages/account/Password').default;
    },
  },
  {
    url: "/account",
    component: function() {
      return require('src/pages/account/My').default;
    },
  },
];

/*
	App
*/
export const routeData = {
  test: "2"
};
export class LinkComponent extends Component {
  render() {
    return (
      <ul><li>test{/*<Link to={this.props.route.url}>{this.props.route.url}</Link>*/}</li></ul>
    );
  }
}
export default class extends Component {
  render() {
    var Routes = [];
    routes.forEach((route, index) => {
      Routes.push(<Route 
        key={"Routes["+index+"]"}
        exact={route.exact}
        path={route.url}
        render={(props) => {
          var RouteComponent = route.component();
          return <RouteComponent key={"render["+index+"]"} {...props} />;
        }}
      />);
    });
    return (
	    <div className="dash-content">
	    	<p>Account route...</p>
	      <Switch>
          <Redirect from="/account/logout" to="/account/login" />
          <Redirect from="/login" to="/account/login" />
          <Redirect from="/logout" to="/account/login" />
	        {Routes}
	      </Switch>
	    </div>
    );
  }
}
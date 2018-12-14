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
  url: "/account",
  linkTitle: "Account"
};
export class LinkComponent extends Component {
  render() {
    return (
      <ul>
        <li>
          <Link to={routeData.url}>{routeData.linkTitle}</Link>
          <ul>
            <li>
              <Link to={routeData.url+"/login"}>Login</Link>
            </li>
            <li>
              <Link to={routeData.url+"/logout"}>Logout</Link>
            </li>
            <li>
              <Link to={routeData.url+"/register"}>Register</Link>
            </li>
            <li>
              <Link to={routeData.url+"/password"}>Password</Link>
            </li>
          </ul>
        </li>
      </ul>
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
      <Switch>
        <Redirect from="/account/logout" to="/account/login" />
        <Redirect from="/login" to="/account/login" />
        <Redirect from="/logout" to="/account/login" />
        {Routes}
      </Switch>
    );
  }
}
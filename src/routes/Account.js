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
    url: "/account/logout",
    component: function() {
      return require('src/pages/account/Logout').default;
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
  title: "Account",
  url: "/account",
  subRoutes: [
    {
      title: "Login",
      url: "/account/login",
      loggedIn: false,
    },
    {
      title: "Logout",
      url: "/account/logout",
      loggedIn: true,
    },
    {
      title: "Register",
      url: "/account/register",
      loggedIn: false,
    }
  ]
};
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
        {Routes}
      </Switch>
    );
  }
}
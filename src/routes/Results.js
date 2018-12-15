import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import Async from 'react-code-splitting';

/*
  Routes
*/
var routes = [
  {
    url: "/results/list",
    component: function() {
      return require('src/pages/results/List').default;
    },
  },
  {
    url: "/results/edit/:uid",
    component: function() {
      return require('src/pages/results/Edit').default;
    },
  },
  {
    url: "/results/add",
    component: function() {
      return require('src/pages/results/Add').default;
    },
  },
];

/*
	App
*/
export const routeData = {
  title: "Results",
  url: "/results",
  loggedIn: true,
  subRoutes: [
    {
      title: "List",
      url: "/results/list",
    },
    {
      title: "Add",
      url: "/results/add",
    },
    {
      title: "Edit",
      url: "/results/edit/test",
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
        <Redirect from="/results/edit" to="/results/add" />
        <Redirect from="/results" to="/results/list" />
      </Switch>
    );
  }
}
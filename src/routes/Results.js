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
  url: "/results",
  linkTitle: "Results"
};
export class LinkComponent extends Component {
  render() {
    return (
      <ul>
        <li>
          <Link to={routeData.url}>{routeData.linkTitle}</Link>
          <ul>
            <li>
              <Link to={routeData.url+"/list"}>List</Link>
            </li>
            <li>
              <Link to={routeData.url+"/add"}>Add</Link>
            </li>
            <li>
              <Link to={routeData.url+"/edit/test"}>Edit</Link>
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
        {Routes}
        <Redirect from="/results/edit" to="/results/add" />
        <Redirect from="/results" to="/results/list" />
      </Switch>
    );
  }
}
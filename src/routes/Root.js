import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';

/*
  Routes
*/
var routes = [
  {
    url: "/",
    component: function() {
      return require('src/pages/Home').default;
    },
  }
];

/*
  App
*/
export const routeData = {
  exact: true,
  url: "/",
  linkTitle: "Home"
};
export class LinkComponent extends Component {
  render() {
    return (
      <ul><li><Link to={routeData.url}>{routeData.linkTitle}</Link></li></ul>
    );
  }
}
export default class extends Component {
  render() {
    var route = routes[0];
    return (
      <Route 
        exact={route.exact}
        path={route.url}
        render={(props) => {
          var RouteComponent = route.component();
          return <RouteComponent {...this.props} />;
        }}
      />
    );
  }
}


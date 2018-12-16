import React, { Component } from "react";
import { Route } from 'react-router-dom';

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
  title: "Home"
};
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


import React, { Component } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
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
	    	<p>Aggregators route...</p>
	      <Switch>
	        {Routes}
          <Redirect from="/results/edit" to="/results/add" />
          <Redirect from="/results" to="/results/list" />
	      </Switch>
	    </div>
    );
  }
}
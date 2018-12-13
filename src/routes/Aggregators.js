import React, { Component } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import Async from 'react-code-splitting';

/*
  Routes
*/
var routes = [
  {
    url: "/aggregators/list",
    component: function() {
      return require('src/pages/aggregators/List').default;
    },
  },
  {
    url: "/aggregators/edit/:uid",
    component: function() {
      return require('src/pages/aggregators/Edit').default;
    },
  },
  {
    url: "/aggregators/add",
    component: function() {
      return require('src/pages/aggregators/Add').default;
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
          <Redirect from="/aggregators/edit" to="/aggregators/add" />
          <Redirect from="/aggregators" to="/aggregators/list" />
	      </Switch>
	    </div>
    );
  }
}
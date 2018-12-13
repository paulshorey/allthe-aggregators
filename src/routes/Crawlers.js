import React, { Component } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import Async from 'react-code-splitting';

/*
  Routes
*/
var routes = [
  {
    url: "/crawlers/list",
    component: function() {
      return require('src/pages/crawlers/List').default;
    },
  },
  {
    url: "/crawlers/edit/:uid",
    component: function() {
      return require('src/pages/crawlers/Edit').default;
    },
  },
  {
    url: "/crawlers/add",
    component: function() {
      return require('src/pages/crawlers/Add').default;
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
          <Redirect from="/crawlers/edit" to="/crawlers/add" />
          <Redirect from="/crawlers" to="/crawlers/list" />
	      </Switch>
	    </div>
    );
  }
}
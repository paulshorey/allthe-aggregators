import React, { Component } from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import Async from 'react-code-splitting';

/*
  Routes
*/
var routes = [
  {
    url: "/about/page1",
    component: function() {
      return require('src/pages/about/AboutPage1').default;
    },
  },
  {
    url: "/about/page2",
    component: function() {
      return require('src/pages/about/AboutPage2').default;
    },
  },
  {
    url: "/about",
    exact: true,
    component: function() {
      return require('src/pages/about/AboutRoot').default;
    },
  }
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
	    	<p>About route...</p>
	      <Switch>
	        {Routes}
          <Redirect from="/about" to="/" />
	      </Switch>
	    </div>
    );
  }
}
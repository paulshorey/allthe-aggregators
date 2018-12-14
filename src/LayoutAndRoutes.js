import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import NotFound from "src/pages/NotFound";

/*
  Routes
*/
var getRouteModule = function(whatComponent){
  // we will call the function later, when the user requests the route
  // this may not actually be working right now... need to look into this
  return function(){
    // webpack can not require() a fully variable path:
    var exported = require('./routes/'+whatComponent+'.js');
    // return imported components for later use
    return {
      routeData: exported.routeData,
      RouteComponent: exported.default,
      LinkComponent: exported.LinkComponent
    }
  }
}
// choose routes to use
// more specific routes first. Home (url=='/') should be last. 
// routes with NO url, like NotFound, very last.
var routes = [
  getRouteModule('Aggregators'),
  getRouteModule('Crawlers'),
  getRouteModule('Results'),
  getRouteModule('Account'),
  getRouteModule('About'),
  getRouteModule('Root'),
  getRouteModule('Error')
];

/*
	Layout
*/
export default class extends Component {
  render() {
    var PageRoutes = [];
    var NavSections = {};
    routes.forEach((routeModule, index) => {
      //
      // unpack module
      var rM = routeModule();
      //
      // add <Route />
      PageRoutes.push(<Route 
        key={"Route"+index}
        exact={rM.routeData.exact}
        path={rM.routeData.url}
        render={(props) => {
          return <rM.RouteComponent {...props} />;
        }}
      />);
      //
      // add <Link />
      NavSections[rM.routeData.url] = <rM.LinkComponent key={"link"+index} />;
    });
    return (
      <Router>
          <div className="dashboard">
            <div className="--sidenav">
              {NavSections["/"]}
              {NavSections["/about"]}
              {NavSections["/aggregators"]}
              {NavSections["/crawlers"]}
              {NavSections["/results"]}
              {NavSections["/account"]}
            </div>
            <div className="--content">
              <Switch>
                {PageRoutes}
              </Switch>
            </div>
          </div>
      </Router>
    );
  }
}
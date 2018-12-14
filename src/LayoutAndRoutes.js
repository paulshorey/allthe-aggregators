import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';
import NotFound from "src/pages/NotFound";

/*
  Routes
*/
var getRouteModule = function(whatComponent){
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
var routes = [
  getRouteModule('Aggregators'),
  getRouteModule('Crawlers'),
  getRouteModule('Results'),
  getRouteModule('Account'),
  getRouteModule('About'),
  getRouteModule('Root')
];

/*
	App
*/
export default class extends Component {
  render() {
    var Routes = [];
    var Links = [];
    routes.forEach((routeModule, index) => {
      // unpack module
      var rM = routeModule();
      // create <Route />s
      Routes.push(<Route 
        key={"Route"+index}
        exact={rM.routeData.exact}
        path={rM.routeData.url}
        render={(props) => {
          return <rM.RouteComponent {...props} />;
        }}
      />);
      // create <Link />s
      Links.push(
        <rM.LinkComponent key={"link"+index} />
      );
    });
    return (
      <Router>
          <div className="dash">
            <div className="dash-sidenav">
              {Links.reverse()}
            </div>
            <div className="dash-content">
              <Switch>
                {Routes}
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
      </Router>
    );
  }
}
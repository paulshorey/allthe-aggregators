import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import NotFound from "src/pages/NotFound";
import Header from "src/components/Header";
import NavList from "src/components/NavList";
import './LayoutAndRoutes.scss';

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
      RouteComponent: exported.default
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
    console.log('Layout',this.props);
    var AllRoutes = [];
    var NavLists = {};
    routes.forEach((routeModule, index) => {
      //
      // unpack module
      var rM = routeModule();
      //
      // add <Route />
      AllRoutes.push(<Route 
        key={"Route"+index}
        exact={rM.routeData.exact}
        path={rM.routeData.url}
        render={(props) => {
          return <rM.RouteComponent {...props} />;
        }}
      />);
      //
      // add <Link />
      if (rM.routeData.url) {
        NavLists[rM.routeData.url] = <NavList data={rM.routeData} {...this.props} />;
      }
    });
    return (
      <div className="--layout LayoutAndRoutes">
        <Header className="--head" />
        <div className="--body">
          <div className="--side">
            {NavLists["/"]}
            {NavLists["/about"]}
            {NavLists["/aggregators"]}
            {NavLists["/crawlers"]}
            {NavLists["/results"]}
            {NavLists["/account"]}
          </div>
          <div className="--main">
            <Switch>
              <Redirect from="/login" exact to="/account/login" />
              <Redirect from="/logout" exact to="/account/login" />
              {AllRoutes}
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
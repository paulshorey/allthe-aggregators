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
    console.log('exported.routeData',exported.routeData);
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
      console.log(index, rM);
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
              {Links}
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

// <ul>
//   <li>
//     <Link to="/">Home</Link>
//   </li>
// </ul>
// <ul>
//   <li>
//     <Link to="/account">My Account</Link>
//     <ul>
//       <li>
//         <Link to="/account/login">Login</Link>
//       </li>
//       <li>
//         <Link to="/account/logout">Logout</Link>
//       </li>
//       <li>
//         <Link to="/account/register">Register</Link>
//       </li>
//       <li>
//         <Link to="/account/password">Change Password</Link>
//       </li>
//     </ul>
//   </li>
// </ul>
// 
// <ul>
//   <li>
//     <Link to="/about">About</Link>
//     <ul>
//       <li>
//         <Link to="/about/page1">:page1</Link>
//       </li>
//       <li>
//         <Link to="/about/page2">:page2</Link>
//       </li>
//     </ul>
//   </li>
// </ul>
// 
// <ul>
//   <li>
//     <Link to="/aggregators">Aggregators</Link>
//     <ul>
//       <li>
//         <Link to="/aggregators/list">:list</Link>
//       </li>
//       <li>
//         <Link to="/aggregators/add">:add</Link>
//       </li>
//       <li>
//         <Link to="/aggregators/edit">:edit</Link>
//       </li>
//     </ul>
//   </li>
// </ul>
// 
// <ul>
//   <li>
//     <Link to="/crawlers">Crawlers</Link>
//     <ul>
//       <li>
//         <Link to="/crawlers/list">:list</Link>
//       </li>
//       <li>
//         <Link to="/crawlers/add">:add</Link>
//       </li>
//       <li>
//         <Link to="/crawlers/edit">:edit</Link>
//       </li>
//     </ul>
//   </li>
// </ul>
// 
// <ul>
//   <li>
//     <Link to="/results">Results</Link>
//     <ul>
//       <li>
//         <Link to="/results/list">:list</Link>
//       </li>
//       <li>
//         <Link to="/results/add">:add</Link>
//       </li>
//       <li>
//         <Link to="/results/edit">:edit</Link>
//       </li>
//     </ul>
//   </li>
// </ul>
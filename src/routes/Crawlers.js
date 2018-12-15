import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';
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
export const routeData = {
  title: "Crawlers",
  url: "/crawlers",
  loggedIn: true,
  subRoutes: [
    {
      title: "List",
      url: "/crawlers/list",
    },
    {
      title: "Add",
      url: "/crawlers/add",
    },
    {
      title: "Edit",
      url: "/crawlers/edit/test",
    }
  ]
};
export class LinkComponent extends Component {
  render() {
    return (
      <ul>
        <li>
          <Link to={routeData.url}>{routeData.linkTitle}</Link>
          <ul>
            <li>
              <Link to={routeData.url+"/list"}>List</Link>
            </li>
            <li>
              <Link to={routeData.url+"/add"}>Add</Link>
            </li>
            <li>
              <Link to={routeData.url+"/edit/test"}>Edit</Link>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}
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
      <Switch>
        {Routes}
        <Redirect from="/crawlers/edit" to="/crawlers/add" />
        <Redirect from="/crawlers" to="/crawlers/list" />
      </Switch>
    );
  }
}
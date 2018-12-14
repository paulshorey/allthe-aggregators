import React, { Component } from "react";
import { Route, Switch, Redirect, Link } from 'react-router-dom';

/*
  Routes
*/
import NotFound from 'src/pages/NotFound';

/*
  App
*/
export const routeData = {
};
export class LinkComponent extends Component {
  render() {
    return (
      null
    );
  }
}
export default class extends Component {
  render() {
    return (
      <Route component={NotFound} />
    );
  }
}


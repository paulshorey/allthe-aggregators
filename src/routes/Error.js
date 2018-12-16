import React, { Component } from "react";
import { Route } from 'react-router-dom';

/*
  Routes
*/
import NotFound from 'src/pages/NotFound';

/*
  App
*/
export const routeData = {
};
export default class extends Component {
  render() {
    return (
      <Route component={NotFound} />
    );
  }
}


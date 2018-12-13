import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import Async from 'react-code-splitting';

import RouteLogin from './auth/Login';
import RouteLogout from './auth/Logout';
import RouteRegister from './auth/Register';
import RoutePassword from './auth/Password';

export default class Account extends Component {
  render() {
    return (
      <div>
        <p>Auth route...</p>
        <Switch>
      		<Route path="/login" component={RouteLogin} />
      		<Route path="/logout" component={RouteLogout} />
      		<Route path=":register" component={RouteRegister} />
          <Route path="/password" component={RoutePassword} />
        </Switch>
      </div>
    )
  }
}
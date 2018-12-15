import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';

/*
	CSS, JS
*/
import "./index.scss";

/*
	Connect Redux (global state)
*/
import { Provider } from "react-redux";
import rx_store from "src/redux/store";

/*
	App
*/
import LayoutAndRoutes from "src/LayoutAndRoutes";

/*
	Routes
*/
ReactDOM.render(
	<Provider store={rx_store}>
		<Router>
			<Route component={LayoutAndRoutes} />
		</Router>
	</Provider>
, document.getElementById('App'));
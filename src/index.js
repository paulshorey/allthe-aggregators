import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "src/scripts/css/index.scss";

/*
	Connect Redux (global state)
*/
import { Provider } from "react-redux";
import redux_store from "src/redux/store";

/*
	App
*/
import LayoutAndRoutes from "src/LayoutAndRoutes";

/*
	Routes
*/
ReactDOM.render(
	<Provider store={redux_store}>
		<LayoutAndRoutes />
	</Provider>
, document.getElementById('App'));
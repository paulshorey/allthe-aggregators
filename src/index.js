import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "src/scripts/css/index.scss";

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
		<LayoutAndRoutes />
	</Provider>
, document.getElementById('App'));
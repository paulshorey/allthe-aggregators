import React, { Component } from "react";
import ReactDOM from 'react-dom';
import "./index.scss";

/*
	Connect Redux (global state)
*/
import { Provider } from "react-redux";
import redux_store from "./redux/store";

/*
	App
*/
import LayoutAndRoutes from "./App";



ReactDOM.render(
	<Provider store={redux_store}>
		<LayoutAndRoutes />
	</Provider>
, document.getElementById('App'));
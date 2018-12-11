import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import "./index.scss";

/*
	Connect Redux (global state)
*/
import { Provider } from "react-redux";
import redux_store from "./redux/store";
import AuthExample from "./AuthExample";



ReactDOM.render(<AuthExample />, document.getElementById('App'));
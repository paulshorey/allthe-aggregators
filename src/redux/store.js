import { applyMiddleware, createStore, combineReducers } from "redux";

/*
	MIDDLEWARE
	will intercept each action, and do something before the reducers
*/
import logger from "redux-logger";
import thunk from "redux-thunk";

/*
	REDUCERS
	will receive an action (and state), and modify the state
*/

import actions from "./reducer_actions";
import account from "./reducer_account";

let reducers = combineReducers({
  account,
  actions
});

/*
	STORE
	"state" is generally the "application state", but in React it means specifically "this.state", or the variable application state local and isolated in a particular component
	"store" is simply a word, meaning "global state". Store is state which is shared between components.
*/
const store = createStore(reducers, applyMiddleware(thunk, logger));

export default store;

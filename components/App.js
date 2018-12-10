import React from "react";

/*
  Connect Redux (global state)
*/
import { Provider } from "react-redux";
import redux_store from "../redux/store";

/*
  DOM
*/
export default class extends React.Component {
  componentDidMount() {
    document.body.classList.add("ui_loading");
  }

  render() {
    return (
      <Provider store={redux_store}>
        <p>Hello World</p>
      </Provider>
    );
  }
}

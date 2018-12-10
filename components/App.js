import Head from "next/head";
import React from "react";

import Header from "../components/Header.js";
import LeftColumn from "../components/LeftColumn.js";
import MiddleColumn from "../components/MiddleColumn.js";
import LoadingAnimation from "../components/LoadingAnimation.js";
import ModalPortMetrics from "../components/ModalPortMetrics.js";
import ModalCountryMetrics from "../components/ModalCountryMetrics.js";
import ModalAuditTrail from "../components/ModalAuditTrail.js";

/*
  Connect Redux (global state)
*/
import { Provider } from "react-redux";
import redux_store from "../redux/store";
import * as uiActionCreators from "../redux/ui/actionCreators";

/*
  DOM
*/
export default class extends React.Component {
  componentDidMount() {
    document.body.classList.add("mapLoading");

    /******
     ** Connect Redux to window, so old code can interact with React/Redux
     */
    window.redux_dispatch = redux_store.dispatch;
    window.uiActionCreators = uiActionCreators;

    /******
     ** Include <script src=""></script> tags here AFTER the HTML has rendered
     */
    // Force refresh entire page at a time - instead of React's default behavior to reload a single component when the code for it changes
    if (!window.scriptsAlreadyLoaded) {
      // after DOM Ready
      window.loadScript("/static/javascripts/init.js");
      // if React component re-rendering, DO NOT re-load all these scripts:
      window.scriptsAlreadyLoaded = true;
    } else {
      /*
        RELOAD PAGE when any React JS file changes
      */
      // For React/Webpack dev environment (Hot Module Reloading)
      // When a js file changes in the codebase, Webpack will try to refresh the web browser
      // But, Webpack doesn't reload the whole page. So, we fix it here.
      window.location.reload();
    }
  }

  render() {
    return (
      <Provider store={redux_store}>
        <React.Fragment>
          <Header />

          {typeof window !== "undefined" ? (
            <React.Fragment>
              <div id="appContent">
                <LeftColumn />

                <MiddleColumn />
              </div>

              <ModalPortMetrics />
              <ModalCountryMetrics />
              <ModalAuditTrail />

              <LoadingAnimation />
            </React.Fragment>
          ) : null}
        </React.Fragment>
      </Provider>
    );
  }
}

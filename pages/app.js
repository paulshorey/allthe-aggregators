/*
  React
*/
import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic";

/*
  CSS
*/
import "antd/dist/antd.css";
// import StyledWhatever from './styled/index';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

/*
  Export
*/
const App = dynamic(() => import("../components/App.js"), {
});
export default class extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <React.Fragment>
        {/* <head> section, same as in regular HTML */}
        <Head>
          <title>AllThe ~ APP</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/static/images/favicon.ico" />
          {/* <link rel="stylesheet" type="text/css" href="/static/css/icomoon/style.css" /> */}
          <script type="text/javascript" src="/static/js/common.js"></script>
        </Head>

        <App />
        
      </React.Fragment>
    );
  }
}

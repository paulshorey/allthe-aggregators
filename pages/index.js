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
// import Styled from './styled/index';
import "./css/index.css";

/*
  ROUTE COMPONENT
*/
const PageLogin = dynamic(() => import("../componentsPages/Login.js"), {
});

/*
  VIEW
*/
export default class extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Head>
          <title>AllThe ~ Authenticate</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/static/images/favicon.ico" />
          {/* <link rel="stylesheet" type="text/css" href="/static/css/icomoon/style.css" /> */}
          <script type="text/javascript" src="/static/js/common.js"></script>
        </Head>
        <PageLogin />
      </React.Fragment>
    );
  }
}

import Head from "next/head";
import React, { Component } from "react";

class LoadingAnimation extends Component {
  render() {
    return (
      <div className="pageLoader">
        <div className="pageLoaderTitle">Loading...</div>
        <div className="pageLoaderElement __1" />
        <div className="pageLoaderElement __2" />
        <div className="pageLoaderElement __3" />
        <div className="pageLoaderElement __4" />
      </div>
    );
  }
}

export default LoadingAnimation;

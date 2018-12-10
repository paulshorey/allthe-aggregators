import Head from "next/head";
import React from "react";

import dynamic from "next/dynamic";

const App = dynamic(() => import("../components/App.js"), {
  ssr: false,
  loading: () => <p />
});

export default class extends React.Component {
  state = {
    scriptsLoaded: false
  };
  componentDidMount() {
    /******
     ** Wait until the <meta> <link> and <script> tags have rendered
     ** ONLY THEN, load the app components, Redux, and instantiate window.map, in <App>
     */
    this.setState({
      scriptsLoaded: true
    });
  }
  render() {
    return (
      <React.Fragment>
        {/* <head> section, same as in regular HTML */}
        <Head>
          <title>IST ~ React/Redux</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/static/images/favicon.ico" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/bootstrap.3.3.7.min.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/bootstrap-tagsinput.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/jquery-ui.min.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/bootstrap-tour.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/vis-network.min.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/toggleSwitch.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/index.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/header.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/xHamburgerButton.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/accordion.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/LeftColumn.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/map.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/openlayers.4.6.5.ol.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/ol-ext.min.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/pagination.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/3rdparty/daterangepicker.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/icomoon/style.css" />
          {/*// 3rd party libraries*/}
          <script type="text/javascript" src="/static/javascripts/3rdparty/jquery-3.2.1.min.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/jquery-ui.min.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/pagination.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/bootstrap.min.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/vis-network.min.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/openlayers.4.6.5.ol.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/ol-ext.min.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/plotly-latest.min.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/bootstrap-tagsinput.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/Queue.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/arc.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/moment.js"></script>
          <script type="text/javascript" src="/static/javascripts/3rdparty/daterangepicker.js"></script>
          {/*// our own libraries*/}
          <script type="text/javascript" src="/static/javascripts/common.js"></script>
          {/*// utils*/}
          <script type="text/javascript" src="/static/javascripts/utils/exporter.js"></script>
          <script type="text/javascript" src="/static/javascripts/utils/campaign-clock.js"></script>
          {/*// clicks and callbacks -> to be refactored into React/Redux*/}
          <script type="text/javascript" src="/static/javascripts/clicks.js"></script>
          {/*// map things*/}
          <script type="text/javascript" src="/static/javascripts/map/map-ajax-interface.js"></script>
          <script type="text/javascript" src="/static/javascripts/map/style-manager.js"></script>
          <script type="text/javascript" src="/static/javascripts/map/feature-manager.js"></script>
          <script type="text/javascript" src="/static/javascripts/map/layer-manager.js"></script>
          <script type="text/javascript" src="/static/javascripts/map/map.js"></script>
        </Head>
        <App />
      </React.Fragment>
    );
  }
}

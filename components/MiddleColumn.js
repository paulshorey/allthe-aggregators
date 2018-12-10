import React, { Component } from "react";

import JourneyTimeseries from "../components/middleSections/JourneyTimeseries.js";

import { connect } from "react-redux";

class MiddleColumn extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="middleColumn">

        {Object.keys(this.props.ui.journeyTimeSeries_data).length > 0 && (
          <div id="pastJourneys_div">
            <JourneyTimeseries />
          </div>
        )}

        <div id="mapContainer">
          <div id="map" />
          <div id="hover-popup" className="ol-popup">
            <div id="popup-hover-content" />
          </div>
          <div id="click-popup" className="ol-popup">
            <div id="popup-click-content" />
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps)(MiddleColumn);

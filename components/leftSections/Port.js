import React, { Component } from "react";
import { connect } from "react-redux";
import PortUpdateRegions from "./components/PortUpdateRegions";
import PortInfo from "./components/PortInfo";

class LeftSectionPort extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-port"}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                // data needs to be passed, right now its null
                redux_dispatch(uiActionCreators.openSection("port"));
              }}
            >
              Port Info:
            </h2>
            <div
              onClick={() => {
                redux_dispatch(uiActionCreators.closeSection("port"));
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              <div className="infoSection" id="popup-port">
                
                {/*Heading and lines of info*/}
                <PortInfo port={this.props.port} />

                {/*Buttons*/}
                <div className="infos">
                  <div className="ship-controls">
                    <div className="ship-control show-portThreshold">
                      <div className="buttons">
                        <PortThresholdButton isViewing={this.props.ui.portThreshold_viewing} />
                      </div>
                    </div>

                    {/*<!-- Port Regions -->*/}
                    <PortUpdateRegions />

                    {/*<!-- Port Threshold -->*/}
                    <div className="ship-control show-pastJourneys">
                      <div className="buttons _ifNotOpened">
                        <PastJourneysButton pastJourneysSectionIsOpen={this.props.ui.leftSections_enabled.has("pastJourneys")} />
                      </div>
                    </div>
                  </div>
                  <div className="ship-controls">
                    <div className="ship-control">
                      <div className="buttons">
                        <PortMetricsButton portMetricsSectionIsOpen={this.props.ui.leftSections_enabled.has("metrics")} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />
      </React.Fragment>
    );
  }
}

function PortThresholdButton(props) {
  return props.isViewing ? <ClearPortThresholdButton /> : <ViewPortThresholdButton />;
}

function ViewPortThresholdButton() {
  return (
    <button
      id="port-distance-threshold-button"
      className="bl _show"
      onClick={() => {
        redux_dispatch(uiActionCreators.portThreshold_create());
      }}
    >
      View Distance Threshold
    </button>
  );
}

function ClearPortThresholdButton() {
  return (
    <button
      className="bl _hide"
      onClick={() => {
        redux_dispatch(uiActionCreators.portThreshold_remove());
      }}
    >
      Clear Distance Threshold
    </button>
  );
}

function PastJourneysButton(props) {
  return props.pastJourneysSectionIsOpen ? <ClearPastJourneysButton /> : <ViewPastJourneysButton />;
}

function ViewPastJourneysButton() {
  return (
    <button
      className="bl _show"
      onClick={() => {
        window.document.body.classList.add("mapLoading");
        window
          .redux_dispatch(uiActionCreators.fetchPortTimeline())
          .then(response => window.redux_dispatch(uiActionCreators.fetchPortPastJourneys(response)))
          .catch(() => {})
          .then(() => window.document.body.classList.remove("mapLoading"));
      }}
    >
      View Past Journeys
    </button>
  );
}

function ClearPastJourneysButton() {
  return (
    <button
      className="bl _show"
      onClick={() => {
        redux_dispatch(uiActionCreators.closeSection("pastJourneys"));
      }}
    >
      Clear Past Journeys
    </button>
  );
}

function PortMetricsButton(props) {
  return props.portMetricsSectionIsOpen ? <ClearPortMetricsButton /> : <ViewPortMetricsButton />;
}

function ViewPortMetricsButton() {
  return (
    <button
      className="bl"
      onClick={() => {
        // console.log('this.props.port',this.props);
        redux_dispatch(uiActionCreators.portMetrics({port_name:"See Port.js ViewPortMetricsButton"}))
      }}
    >
      View Metrics
    </button>
  );
}

function ClearPortMetricsButton() {
  return (
    <button
      className="bl"
      onClick={() => {
        redux_dispatch(uiActionCreators.portMetrics(false))
      }}
    >
      Clear Metrics
    </button>
  );
}

const mapStateToProps = state => ({
  ui: state.ui,
  port: state.ui.selectedPort_data
});

export default connect(mapStateToProps)(LeftSectionPort);

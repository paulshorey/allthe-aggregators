import React from "react";
import { connect } from "react-redux";
import * as uiActionCreators from "../../redux/ui/actionCreators";

class LeftSectionShip extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-ship"}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                window.redux_dispatch(uiActionCreators.openSection("ship"));
              }}
            >
              Ship Info:
            </h2>
            <div
              onClick={() => {
                window.redux_dispatch(uiActionCreators.closeSection("ship"));
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              {/* Ship Info */}
              <section className="infoSection" id="popup-ship">
                <h3 id="vessel-imo-header">
                  <span className="map-icon-xl icon-ship" />
                  <span>{this.props.ship.imo}</span>
                </h3>
                <div className="infos">
                  <p>
                    <label>Lat:</label>
                    <span className="spacer" />
                    <span className="value">{this.props.ship.lat}</span>
                  </p>
                  <p>
                    <label>Lon:</label>
                    <span className="spacer" />
                    <span className="value">{this.props.ship.lon}</span>
                  </p>
                  <p>
                    <label>Flag:</label>
                    <span className="spacer" />
                    <span className="value">{this.props.ship.flag}</span>
                  </p>
                  <p>
                    <label>Dead Weight Category:</label>
                    <span className="spacer" />
                    <span className="value">{this.props.ship.dead_wt_cat}</span>
                  </p>
                  <p>
                    <label>Ship Category:</label>
                    <span className="spacer" />
                    <span className="value">{this.props.ship.ship_cat}</span>
                  </p>
                  <p>
                    <label>Operator Name:</label>
                    <span className="spacer" />
                    <span className="value">{this.props.ship.operator_name}</span>
                  </p>
                  <div className="ship-controls">
                    {/* Current Journey */}
                    <div className="ship-control show-currentJourney">
                      <div className="buttons">
                        <CurrentJourneyButton isViewing={this.props.ui.currentJourney_viewing} />
                      </div>
                    </div>
                    {/* Past Journeys */}
                    <div className="ship-control show-pastJourneys">
                      <div className="buttons _ifNotOpened">
                        <PastJourneysButton pastJourneysSectionIsOpen={this.props.ui.leftSections_enabled.has("pastJourneys")} />
                      </div>
                    </div>
                    {/* Predictions */}
                    <div className="ship-control show-predictions">
                      <div className="buttons">
                        <PredictionsButton predictionsSectionIsOpen={this.props.ui.leftSections_enabled.has("predictions")} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <hr />
      </React.Fragment>
    );
  }
}

function CurrentJourneyButton(props) {
  return props.isViewing ? <ClearCurrentJourneyButton /> : <ViewCurrentJourneyButton />;
}

function ClearCurrentJourneyButton() {
  return (
    <button
      id="current-journey-button"
      className="bl _hide"
      onClick={() => {
        window.redux_dispatch(uiActionCreators.clearCurrentJourney());
      }}
    >
      Clear Current Journey
    </button>
  );
}

function ViewCurrentJourneyButton() {
  return (
    <button
      className="bl _show"
      onClick={() => {
        window.document.body.classList.add("mapLoading");
        window
          .redux_dispatch(uiActionCreators.fetchCurrentJourney())
          .catch(() => {})
          .then(() => window.document.body.classList.remove("mapLoading"));
      }}
    >
      View Current Journey
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
          .redux_dispatch(uiActionCreators.fetchVesselTimeline())
          .then(response => window.redux_dispatch(uiActionCreators.fetchVesselPastJourneys(response)))
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

function PredictionsButton(props) {
  return props.predictionsSectionIsOpen ? <ClearPredictionsButton /> : <ViewPredictionsButton />;
}

function ViewPredictionsButton() {
  return (
    <button
      className="bl _show"
      onClick={() => {
        document.body.classList.add("mapLoading");
        redux_dispatch(uiActionCreators.fetchMockPredictions())
          .catch(() => {})
          .then(() => document.body.classList.remove("mapLoading"));
      }}
    >
      View Predictions
    </button>
  );
}

function ClearPredictionsButton() {
  return (
    <button
      className="bl _show"
      onClick={() => {
        redux_dispatch(uiActionCreators.closeSection("predictions"));
      }}
    >
      Clear Predictions
    </button>
  );
}

const mapStateToProps = state => {
  return {
    ui: state.ui,
    ship: state.ui.selectedVessel_data
  };
};

export default connect(mapStateToProps)(LeftSectionShip);

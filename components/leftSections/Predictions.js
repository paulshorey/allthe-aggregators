import React, { Component } from "react";
import { connect } from "react-redux";
import PortPredictionsContainer from "./components/PortPredictionsContainer";

class LeftSectionPredictions extends Component {
  render() {
    var ship = this.props.ui.selectedVessel_data;
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-predictions"}>
          <div className="leftHeading">
            <h2
              id="predictions-header"
              onClick={() => {
                redux_dispatch(uiActionCreators.openSection("predictions"));
              }}
            >
              Predictions:
            </h2>
            <div
              onClick={() => {
                redux_dispatch(uiActionCreators.closeSection("predictions"));
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              <div className="infoSection" id="popup-predictions">
                <div className="infos">
                  <p>
                    <label>Load Date:</label>
                    <span className="spacer" />
                    {<span className="value">{ship["c_start_date"]}</span>}
                  </p>
                  <p>
                    <label>Start Port ID:</label>
                    <span className="spacer" />
                    {<span className="value">{ship.c_start_port_id}</span>}
                  </p>
                  <p>
                    <label>Cargo Type:</label>
                    <span className="spacer" />
                    {<span className="value">{ship.cargo_type}</span>}
                  </p>
                  <p>
                    <label>Volume:</label>
                    <span className="spacer" />
                    {<span className="value">{ship.volume} (bbls)</span>}
                  </p>
                  <p>
                    <label>Cargo Owner:</label>
                    <span className="spacer" />
                    {<span className="value">{ship.cargo_owner}</span>}
                  </p>
                  <p>
                    <label>Cargo Grade:</label>
                    <span className="spacer" />
                    {<span className="value">{ship.cargo_grade}</span>}
                  </p>
                  <p>
                    <label>Cargo Charterer:</label>
                    <span className="spacer" />
                    {<span className="value">{ship.cargo_charterer}</span>}
                  </p>
                </div>
                <div className="inputs">
                  <PortPredictionsContainer ship={ship} />
                </div>
                <div className="buttons">
                  <div>
                    <button
                      id="port-prediction-export-button"
                      className="bl _show"
                      onClick={() => {
                        window.onVesselExportPortPredictionsClick();
                      }}
                    >
                      Export Port Predictions
                    </button>
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

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps)(LeftSectionPredictions);

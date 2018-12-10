import React, { Component } from "react";
import { connect } from "react-redux";

class LeftSectionPortMetrics extends Component {
  componentWillMount() {
    var portPlot = document.getElementById("port-plot");
    if (portPlot) {
      if (portPlot.data && portPlot.layout) {
        Plotly.purge("port-plot");
        portPlot.classList.remove("js-plotly-plot");
      }
      portPlot.innerHTML = "<h5>loading...</h5>";
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-metrics"}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                window.redux_dispatch({
                  type: "OPEN_SECTION",
                  section: "metrics"
                });
              }}
            >
              Port Metrics
            </h2>
            <div
              onClick={() => {
                window.redux_dispatch({
                  type: "CLOSE_SECTION",
                  section: "metrics"
                });
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              {/*<!-- info -->*/}
              <div className="infoSection" id="port-plot">
                <h5>loading...</h5>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ display: "none" }} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps)(LeftSectionPortMetrics);

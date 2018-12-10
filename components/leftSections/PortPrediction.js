import React, { Component } from "react";
import { connect } from "react-redux";
import PortUpdateRegions from "./components/PortUpdateRegions";
import PortInfo from "./components/PortInfo";

class LeftSectionPortPrediction extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-portPrediction"}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                // data needs to be passed, right now its null
                redux_dispatch(uiActionCreators.openSection("portPrediction"));
              }}
            >
              Predicted Port:
            </h2>
            <div
              onClick={() => {
                redux_dispatch(uiActionCreators.closeSection("portPrediction"));
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              <div className="infoSection" id="popup-port">
                <PortInfo port={this.props.port} />
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
  ui: state.ui,
  port: state.ui.selectedPort_data
});

export default connect(mapStateToProps)(LeftSectionPortPrediction);

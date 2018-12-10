import React, { Component } from "react";
import { connect } from "react-redux";

class PortUpdateRegions extends Component {
  render() {
    return (
      <div className="ship-control shadowBox">
        <div id="port-region-update-section" className="inputs">
          <p>
            <label>Crude Region: </label>
            <input
              type="text"
              id="port-crude-region-input"
              onChange={event => {
                this.props.crude_region = event.target.value;
              }}
              defaultValue={this.props.crude_region}
            />
          </p>
          <p>
            <label>Gasoline Region: </label>
            <input
              type="text"
              id="port-gasoline-region-input"
              onChange={event => {
                this.props.gasoline_region = event.target.value;
              }}
              defaultValue={this.props.gasoline_region}
            />
          </p>
          <div>
            <button
              className="bl _show"
              onClick={() => {
                window.redux_dispatch(
                  window.uiActionCreators.portUpdateRegions({
                    crude_region: this.props.crude_region,
                    gasoline_region: this.props.gasoline_region
                  })
                );
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  crude_region: state.ui.selectedPort_data.crude_region,
  gasoline_region: state.ui.selectedPort_data.gasoline_region
});

export default connect(mapStateToProps)(PortUpdateRegions);

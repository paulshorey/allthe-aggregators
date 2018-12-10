import React, { Component } from "react";
import { connect } from "react-redux";

class PredictionTree extends Component {
  DatalistOptions = [];
  componentWillReceiveProps(props) {
    // create datalist
    for (var i = 0; i < props.ui.vesselsDensityPlaybackSlider_length - 1; i++) {
      this.DatalistOptions.push(<option>{i.toString()}</option>);
    }
  }
  render() {
    return this.props.ui.vesselsDensityPlaybackSlider_length ? (
      <React.Fragment>
        <input
          id="playback-input-slider"
          onChange={event => {
            console.log("event.target.value", event.target.value);
            campaignClock.pause();
            campaignClock.setPosition(parseInt(event.target.value));
          }}
          type="range"
          min="0"
          max={this.props.ui.vesselsDensityPlaybackSlider_length - 1}
          step="1"
          list="playback-index-list"
        />
        <datalist id="playback-index-list">{this.DatalistOptions}</datalist>
      </React.Fragment>
    ) : null;
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps)(PredictionTree);

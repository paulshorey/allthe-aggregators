import React, { Component } from "react";

import SectionSearch from "./leftSections/Search.js";
import SectionFind from "./leftSections/Find.js";
import SectionToggle from "./leftSections/Toggle.js";
import SectionShip from "./leftSections/Ship.js";
import SectionPredictions from "./leftSections/Predictions.js";
import SectionPastJourneys from "./leftSections/PastJourneys.js";
import SectionPort from "./leftSections/Port.js";
import SectionPortPrediction from "./leftSections/PortPrediction.js";

import { connect } from "react-redux";

class LeftColumn extends Component {
  render() {
    /*
      which sections to enable? which to expand?
    */
    let enabledExpanded = sectionName => {
      let className = "";
      if (this.props.ui.leftSections_enabled.has(sectionName)) {
        className += " isEnabled";
      }
      if (sectionName === this.props.ui.leftSections_expanded) {
        className += " isExpanded";
      }
      return className;
    };
    return (
      <div id="leftColumn">
        <SectionSearch className={enabledExpanded("search")} />
        <SectionFind className={enabledExpanded("find")} />
        <SectionToggle className={enabledExpanded("toggle")} />
        <SectionShip className={enabledExpanded("ship")} />
        <SectionPredictions className={enabledExpanded("predictions")} />
        <SectionPortPrediction className={enabledExpanded("portPrediction")} />
        <SectionPort className={enabledExpanded("port")} />
        <SectionPastJourneys className={enabledExpanded("pastJourneys")} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps)(LeftColumn);

import React, { Component } from "react";
import { connect } from "react-redux";
import VesselDensityPlaybackSlider from "./components/VesselDensityPlaybackSlider";

class LeftSectionSearch extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-search"}>
          <div className="leftHeading">
            <h2
              id="search-header"
              onClick={() => {
                redux_dispatch(uiActionCreators.openSection("search"));
              }}
            >
              Search
            </h2>
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              <div id="vessel-search-section" className="searchSection searchSection-ships">
                <h3>
                  <span className="map-icon-xl icon-ship" />
                  <span>Ships</span>
                  <label>filter by:</label>
                </h3>
                <div className={"inputs" + (this.props.ui.searchSections_enabled.has("ships") ? "" : " disabled")}>
                  {/*<!-- <p>Filter by Ship Category</p> -->*/}
                  <input id="vessel-ship-category-input" type="text" data-role="tagsinput" placeholder="Ship Category..." />
                  {/*<!-- <p>Filter by IMO</p> -->*/}
                  <input id="vessel-imo-input" type="text" data-role="tagsinput" placeholder="IMO..." />
                  {/*<!-- <p>Filter by Flag</p> -->*/}
                  <input id="vessel-flag-input" type="text" data-role="tagsinput" placeholder="Flag..." />
                  {/*<!-- <p>Filter by Dead Weight Category</p> -->*/}
                  <input id="vessel-dead-weight-category-input" type="text" data-role="tagsinput" placeholder="Dead Weight Category..." />
                  {/*<!-- <p>Filter by Operator Name</p> -->*/}
                  <input id="vessel-operator-name-input" type="text" data-role="tagsinput" placeholder="Operator Name..." />
                  {/*<!-- Filter for a vessels between dates -->*/}
                  <input id="vessel-date-picker" type="text" name="daterange" />
                </div>
                <div className={"buttons" + (this.props.ui.searchSections_enabled.has("ships") ? "" : " disabled")}>
                  <button
                    type="button"
                    className="bl --ship"
                    onClick={() => {
                      var element = $("#vessel-date-picker").data("daterangepicker"),
                        startDate = element.startDate.format("YYYY-MM-DD"),
                        endDate = element.endDate.format("YYYY-MM-DD"),
                        imo = $("#vessel-imo-input").val(),
                        flag = $("#vessel-flag-input").val(),
                        deadWeightCategory = $("#vessel-dead-weight-category-input").val(),
                        shipCategory = $("#vessel-ship-category-input").val(),
                        operatorName = $("#vessel-operator-name-input").val();
                      document.body.classList.add("mapLoading");
                      redux_dispatch(uiActionCreators.fetchVesselsWithFilters(startDate, endDate, imo, flag, deadWeightCategory, shipCategory, operatorName))
                        .catch(() => {})
                        .then(() => document.body.classList.remove("mapLoading"));
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="searchSection searchSection-ports">
                <h3>
                  <span className="map-icon-xl icon-port" />
                  <span>Ports</span>
                  <label>filter by:</label>
                </h3>
                <div className={"inputs" + (this.props.ui.searchSections_enabled.has("ports") ? "" : " disabled")}>
                  {/*<!-- <p>Filter by Country</p> -->*/}
                  <input id="port-country-input" type="text" data-role="tagsinput" placeholder="Country..." />
                  {/*<!-- <p>Filter by Port ID</p> -->*/}
                  <input id="port-id-input" type="text" data-role="tagsinput" placeholder="Port ID..." />
                  {/*<!-- <p>Filter by Port Name</p> -->*/}
                  <input id="port-name-input" type="text" data-role="tagsinput" placeholder="Port Name..." />
                  {/*<!-- <p>Filter by Area Level</p> -->*/}
                  <input id="port-area-level-input" type="text" data-role="tagsinput" placeholder="Area level..." />
                  {/*<!-- <p>Filter by Locality</p> -->*/}
                  <input id="port-locality-input" type="text" data-role="tagsinput" placeholder="Locality..." />
                  <input id="port-crude-region-search-input" type="text" data-role="tagsinput" placeholder="Crude region..." />
                  <input id="port-gasoline-region-search-input" type="text" data-role="tagsinput" placeholder="Gasoline region..." />
                </div>
                <div className={"buttons" + (this.props.ui.searchSections_enabled.has("ports") ? "" : " disabled")}>
                  <button
                    type="button"
                    className="bl --port"
                    onClick={() => {
                      var id = $("#port-id-input").val();
                      var name = $("#port-name-input").val();
                      var locality = $("#port-locality-input").val();
                      var admin = $("#port-area-level-input").val();
                      var country = $("#port-country-input").val();
                      var crudeRegion = $("#port-crude-region-search-input").val();
                      var gasolineRegion = $("#port-gasoline-region-search-input").val();
                      document.body.classList.add("mapLoading");
                      redux_dispatch(uiActionCreators.fetchPortsWithFilters(id, name, locality, admin, country, crudeRegion, gasolineRegion))
                        .catch(() => {})
                        .then(() => document.body.classList.remove("mapLoading"));
                    }}
                  >
                    Search
                  </button>
                  {/*<!-- <button type="button" className="bl --port" onClick={()=>{window.onClearPortsClick()}}>X</button> -->*/}
                </div>
              </div>

              <div className="searchSection searchSection-vessel-density">
                <h3>
                  <span className="map-icon-xl icon-port" />
                  <span>Vessel Density</span>
                  <label>filter by:</label>
                </h3>
                <div className={"inputs" + (this.props.ui.searchSections_enabled.has("vessel_density") ? "" : " disabled")}>
                  {/*<!-- <p>Filter by Journey Type</p> -->*/}
                  <input id="vessel-density-journey-type-input" type="text" data-role="tagsinput" placeholder="Journey type..." />
                  <input id="vessel-density-date-picker" type="text" name="daterange" />
                </div>
                <div className={"buttons" + (this.props.ui.searchSections_enabled.has("vessel_density") ? "" : " disabled")}>
                  <button
                    type="button"
                    className="bl --port"
                    onClick={() => {
                      var element = $("#vessel-density-date-picker").data("daterangepicker");
                      var startDate = element.startDate.format("YYYY-MM-DD");
                      var endDate = element.endDate.format("YYYY-MM-DD");
                      // parse journey type
                      var journeyType = $("#vessel-density-journey-type-input").val();
                      document.body.classList.add("mapLoading");
                      redux_dispatch(uiActionCreators.fetchVesselsDensity(startDate, endDate, journeyType))
                        .catch(() => {})
                        .then(() => document.body.classList.remove("mapLoading"));
                    }}
                  >
                    Search
                  </button>
                </div>
                <div id="campaignClockButtons" className={"buttons" + (this.props.ui.searchSections_enabled.has("vessel_density") ? "" : " disabled")}>
                  <button
                    id="cCB-play"
                    type="button"
                    onClick={() => {
                      window.campaignClock.play();
                      window.$("#campaignClockButtons button").show();
                      window.$(this).hide();
                    }}
                  >
                    <span className="icon-play" />
                  </button>
                  <button
                    id="cCB-pause"
                    type="button"
                    onClick={() => {
                      window.campaignClock.pause();
                      window.$(this).hide();
                      window.$("#cCB-play").show();
                    }}
                    style={{ display: "none" }}
                  >
                    <span className="icon-pause" />
                  </button>
                  <button
                    id="cCB-reverse"
                    type="button"
                    onClick={() => {
                      window.campaignClock.reverse();
                      window.$("#campaignClockButtons button").show();
                      window.$(this).hide();
                    }}
                    style={{ display: "none" }}
                  >
                    <span className="icon-fast-bw" />
                  </button>
                  <button
                    id="cCB-reset"
                    type="button"
                    onClick={() => {
                      window.campaignClock.reset();
                      window.$("#campaignClockButtons button").hide();
                      window.$("#cCB-play").show();
                    }}
                    style={{ display: "none" }}
                  >
                    <span className="icon-to-start" />
                  </button>
                  <select
                    defaultValue="1"
                    onChange={event => {
                      window.campaignClock.setSpeedMultiplier(event.target.value);
                    }}
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                    <option value="5">5x</option>
                    <option value="10">10x</option>
                    <option value="100">100x</option>
                  </select>
                </div>
                <VesselDensityPlaybackSlider />
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

export default connect(mapStateToProps)(LeftSectionSearch);

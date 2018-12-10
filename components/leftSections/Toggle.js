import React, { Component } from "react";
import { connect } from "react-redux";

class LeftSectionToggle extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-toggle"}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                this.props.dispatch(uiActionCreators.openSection("toggle"));
              }}
            >
              Toggle
            </h2>
            <div
              onClick={() => {
                this.props.dispatch(uiActionCreators.closeSection("toggle"));
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              <div className="searchSection">
                <h3>
                  <span className="map-icon-xl icon-ship" />
                  <span className="title">Ships</span>
                  {/*<!-- toggle -->*/}
                  <div id="vessel-toggle" className="toggleSwitch color-ship">
                    <input
                      type="checkbox"
                      id="toggle-search-ship"
                      defaultChecked={this.props.ui.searchSections_enabled.has("ships")}
                      onClick={event => {
                        this.props.dispatch(uiActionCreators.searchSectionEnable("ships", event.target.checked));
                      }}
                    />
                    <label htmlFor="toggle-search-ship" />
                  </div>
                </h3>
                <h3>
                  <span className="map-icon-xl icon-port" />
                  <span className="title">Ports</span>
                  {/*<!-- toggle -->*/}
                  <div id="port-toggle" className="toggleSwitch color-port">
                    <input
                      type="checkbox"
                      id="toggle-search-port"
                      defaultChecked={this.props.ui.searchSections_enabled.has("ports")}
                      onClick={event => {
                        this.props.dispatch(uiActionCreators.searchSectionEnable("ports", event.target.checked));
                      }}
                    />
                    <label htmlFor="toggle-search-port" />
                  </div>
                </h3>
                <h3>
                  <span className="map-icon-xl icon-ship" style={{ background: "var(--color-country)" }} />
                  <span className="title">Countries</span>
                  {/*<!-- toggle -->*/}
                  <div id="country-toggle" className="toggleSwitch color-country">
                    <input
                      type="checkbox"
                      id="toggle-search-country"
                      defaultChecked={this.props.ui.searchSections_enabled.has("countries")}
                      onClick={event => {
                        this.props.dispatch(uiActionCreators.searchSectionEnable("countries", event.target.checked));
                      }}
                    />
                    <label htmlFor="toggle-search-country" />
                  </div>
                </h3>
                <h3>
                  <span className="map-icon-xl icon-ship" style={{ background: "var(--color-vessel-density)" }} />
                  <span className="title">Vessel Density</span>
                  {/*<!-- toggle -->*/}
                  <div id="vessel-density-toggle" className="toggleSwitch color-vessel-density">
                    <input
                      type="checkbox"
                      id="toggle-search-vessel-density"
                      defaultChecked={this.props.ui.searchSections_enabled.has("vessel_density")}
                      onClick={event => {
                        this.props.dispatch(uiActionCreators.searchSectionEnable("vessel_density", event.target.checked));
                      }}
                    />
                    <label htmlFor="toggle-search-vessel-density" />
                  </div>
                </h3>
                <h3>
                  <span className="map-icon-xl icon-ship" style={{ background: "var(--color-vessel-density)" }} />
                  <span className="title">Crude Regions</span>
                  {/*<!-- toggle -->*/}
                  <div id="crude-regions-toggle" className="toggleSwitch color-vessel-density">
                    <input
                      type="checkbox"
                      id="toggle-search-crude-regions"
                      defaultChecked={this.props.ui.searchSections_enabled.has("crude_regions")}
                      onClick={event => {
                        this.props.dispatch(uiActionCreators.searchSectionEnable("crude_regions", event.target.checked));
                      }}
                    />
                    <label htmlFor="toggle-search-crude-regions" />
                  </div>
                </h3>
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

export default connect(mapStateToProps)(LeftSectionToggle);

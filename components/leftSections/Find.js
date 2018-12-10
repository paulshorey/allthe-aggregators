import React, { Component } from "react";

class LeftSectionFind extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={"leftSection" + this.props.className} id={"leftSection-find"} style={{ display: "none !important" }}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                window.redux_dispatch({
                  type: "OPEN_FIND"
                });
              }}
            >
              Find Ship:
            </h2>
            <div
              onClick={() => {
                window.redux_dispatch({
                  type: "OPEN_SEARCH"
                });
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding">
              <div className="searchSection">
                <h3>
                  <span className="map-icon-xl icon-ship" />
                  <span>Enter IMO:</span>
                </h3>
                <div className="inputs">
                  <input id="vessel-imo-input-two" type="text" data-role="tagsinput" placeholder="IMO..." />
                </div>
                <div className="buttons">
                  <button
                    type="button"
                    className="bl --ship"
                    onClick={() => {
                      window.onVesselSearchClick();
                    }}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ display: "none !important" }} />
      </React.Fragment>
    );
  }
}

export default LeftSectionFind;

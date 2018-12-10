import React from "react";

class LeftSectionPort extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h3 id="port-name-header">
          <span className="map-icon-xl icon-port" />
          <span>{this.props.port.name}</span>
        </h3>
        <div className="infos">
          <p>
            <label>ID:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.id_name||"-"}</span>}
          </p>
          <p>
            <label>Lat:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.lat||"-"}</span>}
          </p>
          <p>
            <label>Lon:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.lon||"-"}</span>}
          </p>
          <p>
            <label>Administrative Area Level One:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.administrative_area_level_one||"-"}</span>}
          </p>
          <p>
            <label>Locality:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.locality||"-"}</span>}
          </p>
          <p>
            <label>Country Code:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.country_code||"-"}</span>}
          </p>
          <p>
            <label>Country:</label>
            <span className="spacer" />
            {<span className="value">{this.props.port.country||"-"}</span>}
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default LeftSectionPort;

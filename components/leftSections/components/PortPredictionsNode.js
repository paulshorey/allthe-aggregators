import React, { Component } from "react";

class PortPredictionsNode extends Component {
  Li = [];
  componentWillMount() {
    // console.log("node ", this.props);
    if (this.props.node) {
      // this this.props.node will render as an <li> element, {this.Li}
      var featureData = this.props.node.mainFeature.get("data");
      var node_name = featureData["name"];
      var probability = roundNumber(featureData["probability"] * 100, 2).toString() + "%";
      if (typeof map !== "undefined") {
        // children ~ if this this.props.node has children
        var Li_ul = null;
        if (this.props.node.children.length != 0) {
          var Li_ul_lis = [];
          this.props.node.children.forEach((inner_node, i) => {
            Li_ul_lis.push(<PortPredictionsNode key={inner_node.uniqueId + i} node={inner_node} i={i} />);
          });
          Li_ul = <ul>{Li_ul_lis}</ul>;
        }
        // build class name
        var className = this.props.fromHead ? "port-prediction-enabled port-prediction-child " : "";
        switch (this.props.i) {
          case 0:
            className += "port-prediction-first";
            break;
          case 1:
            className += "port-prediction-second";
            break;
          case 2:
            className += "port-prediction-third";
            break;
        }
        // finally, set the Element to be rendered
        this.Li = (
          <li
            id={this.props.node.uniqueId}
            className={className}
            onClick={event => {
              if (this.props.node) {
                redux_dispatch(uiActionCreators.portPredictions_node(this.props.node));
                event.stopPropagation();
              }
            }}
          >
            <span>
              {node_name}
              <br />
              <span className="caption">probability: {probability}</span>
              <span className='caption view_audit_trail' onClick={event => {
                window.redux_dispatch(uiActionCreators.portPrediction_auditTrail({}));
                event.stopPropagation();
              }}
              >
                View Audit Trail
              </span>
            </span>
            {Li_ul}
          </li>
        );
      }
    }
  }
  render() {
    return <React.Fragment>{this.Li}</React.Fragment>;
  }
}

export default PortPredictionsNode;

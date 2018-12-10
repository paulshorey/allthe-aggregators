import React, { Component } from "react";
import { connect } from "react-redux";
import PortPredictionsNode from "./PortPredictionsNode";

const node_onClick = function(nodeElement) {
  // disable all nodes
  $(".port-prediction-enabled").removeClass("port-prediction-enabled port-prediction-selected port-prediction-child");
  // enable clicked (selected) node
  window.ne = nodeElement;
  console.log(ne);
  $(nodeElement).addClass("port-prediction-enabled port-prediction-selected");
  // enable its children
  $(nodeElement)
    .children("ul")
    .children()
    .addClass("port-prediction-enabled port-prediction-child");
  // enable its parent
  $(nodeElement)
    .parent("ul")
    .parent()
    .addClass("port-prediction-enabled");
  // enable its parent's parent
  $(nodeElement)
    .parent("ul")
    .parent()
    .parent("ul")
    .parent()
    .addClass("port-prediction-enabled");
};

class PortPredictionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListItems: []
    };
  }
  componentDidUpdate(){
    if(this.props.portPredictions_selectedNode_uniqueId) {
      var nodeClicked = document.getElementById(this.props.portPredictions_selectedNode_uniqueId);
      if (nodeClicked) {
        // expand the selected port
        node_onClick(nodeClicked);
        // scroll down so all selected ports are visible
        document.getElementById('port-prediction-export-button').scrollIntoView({behavior:"smooth"});
      }
    }
  }
  componentWillReceiveProps(props) {
    if (typeof map !== "undefined") {
      let ListItems = [];
      // start with the first node (which is actually the ship?)
      let head = map.layerManager.getPortPredictionTree();
      // console.log('head',head);
      if (head && head.children.length != 0) {
        // render every node
        head.children.forEach((node, i) => {
          // if no node is selected, treat "head" as the selected node.
          // Give all first-level nodes "child"-selected
          ListItems.push(<PortPredictionsNode key={node.uniqueId + i} node={node} fromHead={true} i={i} node_onClick={node_onClick} />);
        });
        this.setState({
          ListItems: ListItems
        });
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        <div id="port-prediction-heading">
          <h5
            onClick={(event) => {
              node_onClick(document.getElementById("port-prediction-tree-root"));
              window.onVesselPortPredictionClick();
              event.stopPropagation();
            }}
          >
            <span className="arrow">↓</span>
            <span className="map-icon-xl icon-ship" />
            <span className="text">{this.props.ship.imo}</span>
            <div className="caption">Click port to expand. Click here to go back.</div>
          </h5>
        </div>
        <div className="port-prediction-lists" id="port-prediction-tree-root">
          <ul>{this.state.ListItems}</ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ship: state.ui.selectedVessel_data,
  portPredictions_selectedNode_uniqueId: state.ui.portPredictions_selectedNode_uniqueId
});

export default connect(mapStateToProps)(PortPredictionsContainer);

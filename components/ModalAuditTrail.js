import React, { Component } from "react";
import { connect } from "react-redux";

class ModalAuditTrail extends Component {
  constructor(props) {
    super(props);
    this.modalElement = React.createRef();
  }
  componentDidUpdate(){
    if (Object.keys(this.props.data).length) {      

      // create a network
      var container = document.getElementById('auditTrail_graph');
      while (container.firstChild) container.removeChild(container.firstChild);

      // create an array with nodes
      var nodes = new vis.DataSet([
          {id: 1, label: 'Unload at Port: X'},
          {id: 2, label: 'Status'},
          {id: 3, label: 'Speed\nRange\n10-23'},
          {id: 4, label: 'Draft\nRange\n40-45'},
          {id: 5, label: 'Volume\nRange\n100k-200k'},
          {id: 6, label: 'Loaded'},
          {id: 7, label: 'Speed=14'},
          {id: 8, label: 'Draft=42'},
          {id: 9, label: 'Volume=120k'},
          {id: 10, label: 'Volume increased'}
      ]);

      // create an array with edges
      var edges = new vis.DataSet([
          {from: 1, to: 2},
          {from: 1, to: 3},
          {from: 1, to: 4},
          {from: 1, to: 5},
          {from: 2, to: 6},
          {from: 3, to: 7},
          {from: 4, to: 8},
          {from: 5, to: 9},
          {from: 6, to: 10}
      ]);

      // provide the data in the vis format
      var data = {
          nodes: nodes,
          edges: edges
      };

      var options = {
          width: '100%',
          height: '100%',
          nodes: {
              shape: 'box'
          },
          edges: {
              smooth: false
          },
          physics: false,
          interaction: {
              dragNodes: false, // do not allow dragging nodes
              zoomView: true, // do not allow zooming
              dragView: true  // do not allow dragging
          },
          layout: {
              randomSeed: 1,
              improvedLayout: true,
              hierarchical: {
                  enabled: true,
                  levelSeparation: 200,
                  nodeSpacing: 100,
                  treeSpacing: 10,
                  blockShifting: false,
                  edgeMinimization: true,
                  parentCentralization: true,
                  direction: 'LR',        // UD, DU, LR, RL
                  sortMethod: 'directed'   // hubsize, directed
              }
          }
      };

      // initialize your network!
      var network = new vis.Network(container, data, options);

      // open modal
      $(document.getElementById('auditTrail_modal')).modal('show');

      // self-destruct! (delete data after done with it, so this only opens once)
      this.props.dispatch(uiActionCreators.portPrediction_auditTrail(false));

    }
  }
  render() {
    return (
      <div className="modal fade" id="auditTrail_modal" role="dialog" ref={this.modalElement}>
        <div className="modal-dialog">
          {/* Modal content*/}
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Audit Trail</h4>
            </div>
            <div className="modal-body">
              <div role="tabpanel">
                  {/* Nav tabs */}
                  <ul className="nav nav-tabs" role="tablist">
                      <li role="presentation" className="active"><a href="#graphTab" aria-controls="graphTab" role="tab" data-toggle="tab">Graph</a>

                      </li>
                      <li role="presentation"><a href="#textTab" aria-controls="textTab" role="tab" data-toggle="tab">Text</a>

                      </li>
                  </ul>
                  {/* Tab panes */}
                  <div className="tab-content">
                      <div role="tabpanel" className="tab-pane active" id="graphTab" style={{width:"550px",height:"400px"}}>
                          


                          {/* Main Content */}
                          <div id="auditTrail_graph" style={{width:"550px",height:"400px"}}></div>



                      </div>
                      <div role="tabpanel" className="tab-pane" id="textTab">Text...More Text</div>
                  </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.ui.auditTrail_data
});

export default connect(mapStateToProps)(ModalAuditTrail);

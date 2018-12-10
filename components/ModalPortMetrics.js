import React, { Component } from "react";
import { connect } from "react-redux";

var createImportExportPlot = function(data, name, element, parameters) {
  if (!parameters) {
    parameters = {};
  }
  var dates = data["date"];
  var iLast = data["date"].length - 1;
  var dateLastMS = new Date(data["date"][iLast]).getTime();
  var dateDeltaMS = 2628002880 * 3;
  var dateLastMS_past = dateLastMS - dateDeltaMS; // months in milliseconds
  var dateLastMS_future = dateLastMS + dateDeltaMS; // months in milliseconds
  var formatDate = function(unixTimestamp) {
    var d = new Date(unixTimestamp);
    var date = d.getDate();
    var month = d.getMonth(); //Be careful! January is 0 not 1
    var year = d.getFullYear();

    return year + "-" +(month + 1) + "-" + date;
  }
  var dateLast = formatDate(dateLastMS);
  var dateLast_past = formatDate(dateLastMS_past);
  var dateLast_future = formatDate(dateLastMS_future);
  var yHighest = Math.max.apply(null, data["export_bbls"].concat(data["import_bbls"], data["net_bbls"])) || 0;
  var yLowest = Math.min.apply(null, data["export_bbls"].concat(data["import_bbls"], data["net_bbls"])) || 0;

  // 
  // Color traces
  var exportColor = "#1F77B4";
  var importColor = "#FF7F0E";
  var netColor = "#2CA02C";

  //
  // Real traces
  var exportTrace = {
      x: dates,
      y: data["export_bbls"],
      type: "scatter",
      name: "Export",
      line: {
        color: exportColor
      }
    };
  var importTrace = {
      x: dates,
      y: data["import_bbls"],
      type: "scatter",
      name: "Import",
      line: {
        color: importColor
      }
    };
  var netTrace = {
      x: dates,
      y: data["net_bbls"],
      type: "scatter",
      name: "Net",
      line: {
        color: netColor
      }
    };
  //
  // Predicted traces
  var exportPredicted = {
      x: [dateLast, dateLast_future],
      y: [data["export_bbls"][iLast], data["export_bbls"][iLast]],
      type: "scatter",
      mode: 'lines',
      showlegend: false,
      name: "Exp. predicted",
      line: {
        dash: 'dot',
        color: exportColor
      }
  }
  var importPredicted = {
      x: [dateLast, dateLast_future],
      y: [data["import_bbls"][iLast], data["import_bbls"][iLast]],
      type: "scatter",
      mode: 'lines',
      showlegend: false,
      name: "Imp. predicted",
      line: {
        dash: 'dot',
        color: importColor
      }
  }
  var netPredicted = {
      x: [dateLast, dateLast_future],
      y: [data["net_bbls"][iLast], data["net_bbls"][iLast]],
      type: "scatter",
      mode: 'lines',
      showlegend: false,
      name: "Net. predicted",
      line: {
        dash: 'dot',
        color: netColor
      }
  }

  //
  // console.log('dates',dates);
  var plotData = [exportTrace, importTrace, netTrace, exportPredicted, importPredicted, netPredicted];
  var layout = {
      title: name + "\nVolume",
      margin: {
        l: 56, // yaxis title takes up > 35px (zero tickangle)
        r: 0,
        b: 57, // xaxis title takes up > 35px (zero tickangle)
        t: 35,
        pad: 0
      },
      paper_bgcolor: "transparent",
      XXplot_bgcolor: "transparent",
      xaxis: {
        showticklabels: true,
        showgrid: false,
        tickangle: 0,
        tickfont: {
          family: "sans-serif",
          size: 11,
          color: "#666"
        },
        range: [ dateLast_past, dateLast_future ],
        title: "Date ( 🔍 drag plot to zoom in, 🔎 double click to zoom out )" /* &#x1F50D; &#x1F50E; */
      },
      yaxis: {
        showticklabels: true,
        fixedrange: true,
        tickangle: 0,
        tickfont: {
          family: "sans-serif",
          size: 11,
          color: "#999"
        },
        title: "Volume (bbls)"
      },
      width: 657,
      height: 410,
      shapes: [
        {
          type: 'line',
          x0: dateLast,
          y0: yHighest,
          x1: dateLast,
          y1: yLowest,
          opacity: 1,
          line: {
             width: 1,
             color: '#cccccc'
          }
        }
      ]
    };
  Plotly.newPlot(element, plotData, layout);
};

class ModalCountryChart extends Component {
  constructor(props) {
    super(props);
    this.modalElement = React.createRef();
  }
  componentDidUpdate(){
    if (Object.keys(this.props.data).length) {
      // plot
      createImportExportPlot(this.props.data, this.props.data.port_name, document.getElementById('portMetrics_plot'), {});

      // open modal
      $(document.getElementById('portMetrics_modal')).modal('show');

      // self-destruct! (delete data after done with it, so this only opens once)
      this.props.dispatch(uiActionCreators.portMetrics(false));
    }
  }
  render() {
    return (
      <div className="modal fade" id="portMetrics_modal" role="dialog" ref={this.modalElement}>
        <div className="modal-dialog">
          {/* Modal content*/}
          <div className="modal-content">
            <div className="modal-body">
              
              {/* Main Content */}
              <div id="portMetrics_plot"></div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.ui.portMetrics_data
});

export default connect(mapStateToProps)(ModalCountryChart);

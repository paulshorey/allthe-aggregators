import React, { Component } from "react";
import { connect } from "react-redux";

// Callback function for a plotly graph whenever a user hovers
// over any data points. The map will create a style on selected
// journey to be correlated to the hovered data point.
var _onPlotlyTimeSeriesHover = function(data, id) {
  map.layerManager.removeJourneyHoverPositionLayer();
  // retrieve the index of the hovered data point
  var hoveredPointIndex = data.points.map(function(d) {
    return d.pointNumber;
  })[0];
  // create our feature based on the hover index
  var feature = map.featureManager.journeyHoverFeatures.createJourneyHoverFeature(hoveredPointIndex, id);
  // create our layer based on the feature
  map.layerManager.createJourneyHoverPositionLayer(feature, { zIndex: 4 });
};

// Callback function for a plotly graph whenever a user unhovers
// off of a data point. The journey hover layer will be removed from the map,
// thus removing the feature on the journey.
var _onPlotlyTimeSeriesUnHover = function(data) {
  map.layerManager.removeJourneyHoverPositionLayer();
};

// Callback function for a plotly graph whenever a user changes
// the zoom level of the plot. The map will create a layer defining the boundary of
// the journey that pertains to the plotly graph data points.
var _onPlotlyTimeSeriesZoom = function(data, id) {
  map.layerManager.removeJourneyZoomRangeLayer();
  var gd = document.getElementById("pastJourneys_plotly");
  var xRange = [moment(gd.layout.xaxis.range[0]), moment(gd.layout.xaxis.range[1])];
  var yRange = gd.layout.yaxis.range;
  // console.log("xRange: " + xRange);
  // console.log("yRange: " + yRange);
  var trace = gd.data[0];
  var len = Math.min(trace.x.length, trace.y.length);
  var indexArr = [];

  for (var i = 0; i < len; i++) {
    var x = moment(trace.x[i]);
    var y = trace.y[i];
    // console.log("i: " + i + "\tx: " + x + "y: " + y);
    if (x >= xRange[0] && x <= xRange[1] && y >= yRange[0] && y <= yRange[1]) {
      indexArr.push(i);
      // yInside.push(y);
    } else {
      // console.log("did not add: " + i);
      // if (x < xRange[0]) console.log("1");
      // else if (x > xRange[1]) console.log("2");
      // else if (y < yRange[0]) console.log("3");
      // else console.log("4");
    }
  }
  // if our indices are the same, we do not want to create any style boundaries, thus return
  if (indexArr.length === 0 || indexArr.length === 1) return;
  // console.log("minIndex: ", indexArr[0]);
  // console.log("maxIndex: ", indexArr[indexArr.length - 1]);
  // create our features showing the min/max range of the data on the journey
  var features = map.featureManager.journeyZoomRangeFeatures.createJourneyZoomRangeFeatures(indexArr[0], indexArr[indexArr.length - 1], id);
  // zoom on the section of our range features
  map.centerAroundFeatures(features);
  // we pop the feature at the first index (0-based) in order to ensure nothing is displayed between the boundaries,
  // the only reason for the creation of the feature was to be able to center around all of the features.
  features.splice(1, 1);
  // create our range layer based on the features
  map.layerManager.createJourneyZoomRangeLayer(features, { zIndex: 3 });
};

// // Callback function for a plotly graph whenever a user changes
// // the zoom level of the plot. The map will create a layer defining the boundary of
// // the journey that pertains to the plotly graph data points.
// var _onPlotlyTimeSeriesZoom = function(data, id) {
//   map.layerManager.removeJourneyZoomRangeLayer();
//   var gd = document.getElementById("pastJourneys_plotly"),
//     xRange = gd.layout.xaxis.range,
//     yRange = gd.layout.yaxis.range,
//     trace = gd.data[0],
//     len = Math.max(trace.x.length, trace.y.length),
//     minIndex = -1,
//     maxIndex = len - 1;
//   // iterate over our x and y ranges and determine min/max indices
//   while (++minIndex < maxIndex && !(trace.x[minIndex] >= xRange[0] && trace.x[minIndex] <= xRange[1] && trace.y[minIndex] >= yRange[0] && trace.y[minIndex] <= yRange[1]));
//   while (--maxIndex > minIndex && !(trace.x[maxIndex] >= xRange[0] && trace.x[maxIndex] <= xRange[1] && trace.y[maxIndex] >= yRange[0] && trace.y[maxIndex] <= yRange[1]));
//   // if our indices are the same, we do not want to create any style boundaries, thus return
//   if (minIndex == maxIndex) return;
//   // create our features showing the min/max range of the data on the journey
//   var features = map.featureManager.journeyZoomRangeFeatures.createJourneyZoomRangeFeatures(minIndex, maxIndex, id);
//   // zoom on the section of our range features
//   map.centerAroundFeatures(features);
//   // we pop the feature at the first index (0-based) in order to ensure nothing is displayed between the boundaries,
//   // the only reason for the creation of the feature was to be able to center around all of the features.
//   features.splice(1, 1);
//   // create our range layer based on the features
//   map.layerManager.createJourneyZoomRangeLayer(features, { zIndex: 3 });
// };

class JourneyTimeseries extends Component {
  // clean up after journeyTimeSeries closed
  componentWillUnmount() {
    Plotly.purge("pastJourneys_plotly");
  }
  // create new Plotly plot when journeyTimeSeries opened
  componentDidMount() {
    // remove old instance
    Plotly.purge("pastJourneys_plotly");
    // initialize all plotly dictionary data and layouts
    var id = this.props.ui.journeyTimeSeries_data.id;
    var timeSeriesData = id != null ? map.featureManager.pastJourneysFeatures.getPastJourneysTimeSeriesData(id) : map.featureManager.currentJourneyFeatures.getCurrentJourneyTimeSeriesData();
    var draftData = timeSeriesData.draft;
    var speedData = timeSeriesData.speed;
    var dataTraces = [speedData, draftData];

    // create our plotly layout
    var layout = {
      title: this.props.ui.journeyTimeSeries_data.vessel_imo + " Journey Time Series",
      margin: {
        l: 50, // yaxis title takes up > 35px (zero tickangle)
        r: 3,
        b: 60, // xaxis title takes up > 35px (zero tickangle)
        t: 47,
        pad: 0
      },
      XXpaper_bgcolor: "transparent",
      XXplot_bgcolor: "transparent",
      xaxis: {
        showticklabels: true,
        showgrid: false,
        tickangle: 0,
        tickfont: {
          family: "sans-serif",
          size: 14,
          color: "#666"
        },
        title: "Date",
        exponentformat: "e",
        showexponent: "All"
      },
      yaxis: {
        showticklabels: true,
        fixedrange: true,
        tickangle: 0,
        tickfont: {
          family: "sans-serif",
          size: 14,
          color: "#999"
        },
        title: "Speed/Draft",
        exponentformat: "e",
        showexponent: "All"
      }
    };
    var PlotElement = document.getElementById("pastJourneys_plotly");
    // create plotly time series
    Plotly.plot(PlotElement, dataTraces, layout).then(function() {
      /* auto-resize to parent container */
      Plotly.Plots.resize(PlotElement);
    });
    // create callbacks for hover/unhover/zoom of plotly data points
    PlotElement.on("plotly_hover", function(data) {
      _onPlotlyTimeSeriesHover(data, id);
    });
    PlotElement.on("plotly_unhover", _onPlotlyTimeSeriesUnHover);
    PlotElement.on("plotly_relayout", function(data) {
      _onPlotlyTimeSeriesZoom(data, id);
    });
  }
  render() {
    return (
      <React.Fragment>
        <button
          className="xHamburgerButton"
          type="button"
          onClick={() => {
            redux_dispatch(uiActionCreators.journeyTimeSeries_close());
          }}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="plotlyResponsive">
          <div id="pastJourneys_plotly" />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

export default connect(mapStateToProps)(JourneyTimeseries);

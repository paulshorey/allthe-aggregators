import React, { Component } from "react";
import { connect } from "react-redux";
import StyledPastJourneys from './styled/PastJourneys';


window.onDisplayedJourneyClick = function(uniqueId, id, isVesselJourney) {
  if (id != null) {
    window.redux_dispatch(uiActionCreators.journeyTimeSeries_create({ vessel_imo: uniqueId, id: id }));
    // show paginated journeys before hiding the selected one.
    var paginationContainer = $("#pastJourneys-pagination-container");
    var layers = paginationContainer.pagination("getSelectedPageData");
    for (var i = 0; i < layers.length; i++) layers[i].setVisible(true);
    // hide the other layers that are not equal to the id
    map.layerManager.hidePastJourneysLayersExcludingIndex(id);
  }
};

// Template used for displaying the pagination data for past journeys.
// The function creates the HTML used for displaying a number, journey id, and
// the specified color matches the journey being displayed on the map.
window.pastJourneyTemplate = function(data, featureClicked) {
  // get data
  var isVesselData = featureClicked == "vessel";
  var uniqueId = isVesselData ? map.getSelectedVesselData()["imo"] : map.getSelectedPortData()["id_name"];
  // build html
  var html = "<p><b>Displayed Journeys:</b></p>";
  $.each(data, function(index, item) {
    var color = map.styleManager.getPastJourneyColor(index % 3),
      colorStyle = "rgba(",
      feature = item.getSource().getFeatures()[0];
    for (var i = 0; i < color.length; i++) {
      colorStyle += color[i];
      if (i != color.length - 1) colorStyle += ", ";
    }
    colorStyle += ")";
    html += "<p onclick=onDisplayedJourneyClick('" + uniqueId + "','" + feature.get("journeyLayerId") + "','" + isVesselData + "') " + 'style="cursor: pointer; font-size: 90%; color: ' + colorStyle + '">' + (index + 1) + ") " + feature.get("data")["journey_id"] + "</p>";
  });
  html += "</ul>";
  return html;
};

class LeftSectionPastJourneys extends Component {
  componentWillReceiveProps(newProps) {
    // Creates the past journey pagination UI in the sidebar. Only
    // 3 journeys are displayed at any given time and this is set using
    // the 'pageSize' variable in the pagination declaration. The provided data source are
    // all of the past journey layers.
    //
    // After the initialization of the pagination UI, we set the visibility to true for
    // the currently selected page data (i.e. journeys on the current paginated page).
    //
    // Additionally, there is a callback function called 'afterPaging' which will hide the previously displayed
    // layers from the map and display the currently displayed layers to the map. If any time series plot is open
    // as the user is pagination, the plot will be closed automatically.
    if (newProps.featureClicked) {
      var { featureClicked, pageNumber } = newProps;
      // createPastJourneyPaginationContainer(newProps.featureClicked, newProps.pageNumber);
      var paginationContainer = $("#pastJourneys-pagination-container");
      var dataContainer = $("#pastJourneys-data-container");
      // remove our old pagination if they are present
      paginationContainer.empty();
      dataContainer.empty();
      paginationContainer.pagination({
        dataSource: map.layerManager.getPastJourneysLayers(),
        pageSize: 3,
        pageNumber: pageNumber,
        showPageNumbers: false,
        showNavigator: true,
        callback: function(data, pagination) {
          var html = pastJourneyTemplate(data, featureClicked);
          dataContainer.html(html);
        },
        afterInit: function() {
          var layers = paginationContainer.pagination("getSelectedPageData");
          map.centerAroundFeatures(map.featureManager.pastJourneysFeatures.getPastJourneyFeatures(layers));
          for (var i = 0; i < layers.length; i++) layers[i].setVisible(true);
        }
      });
      paginationContainer.addHook("afterPaging", function() {
        // dispatch an action to modify the pagination number
        redux_dispatch(uiActionCreators.pastJourney_select(paginationContainer.pagination("getSelectedPageNum")));
        // hide the previously displayed layers and show the new paginated layers
        var data = map.layerManager.getPastJourneysLayers();
        for (var i = 0; i < data.length; i++) data[i].setVisible(false);
        var layers = paginationContainer.pagination("getSelectedPageData");
        map.centerAroundFeatures(map.featureManager.pastJourneysFeatures.getPastJourneyFeatures(layers));
        for (var i = 0; i < layers.length; i++) layers[i].setVisible(true);
        // remove our zoom range layer, hover layer, and the plotly time series.
        // We do this each time we page to ensure the previous journey selected
        // is not still showing as new journeys are being displayed.
        map.layerManager.removeJourneyZoomRangeLayer();
        map.layerManager.removeJourneyHoverPositionLayer();
        // close journey time series (maximize map)
        redux_dispatch(uiActionCreators.journeyTimeSeries_close());
      });
    }
  }
  render() {
    return (
      <StyledPastJourneys>
        <div className={"leftSection" + this.props.className} id={"leftSection-pastJourneys"}>
          <div className="leftHeading">
            <h2
              onClick={() => {
                redux_dispatch(uiActionCreators.openSection("pastJourneys"));
              }}
            >
              Past Journeys:
            </h2>
            <div
              onClick={() => {
                redux_dispatch(uiActionCreators.closeSection("pastJourneys"));
              }}
              className="x"
            />
          </div>
          <div className="leftContent">
            <div className="leftContentPadding inputs">
              <input id="pastJourneys_datePicker" type="text" name="daterange" />
              <div>
                <button
                  id="past-journeys-search-dates-button"
                  className="bl _show"
                  onClick={() => {
                    map.featureManager.pastJourneysFeatures.clearPastJourneysTimeSeriesData();
                    map.layerManager.removePastJourneysLayers();
                    redux_dispatch({
                      type: "CLOSE_JOURNEYTIMESERIES"
                    });
                    var selectedVessel = this.props.selectedVessel_data;
                    var picker = $("#pastJourneys_datePicker").data("daterangepicker");
                    var startDate = picker.startDate.format("YYYY-MM-DD");
                    var endDate = picker.endDate.format("YYYY-MM-DD");
                    var data = [selectedVessel["imo"], selectedVessel["journey_id"], startDate, endDate];
                    document.body.classList.add("mapLoading");
                    redux_dispatch(uiActionCreators.fetchVesselPastJourneys(data))
                      .catch(() => {})
                      .then(() => document.body.classList.remove("mapLoading"));
                  }}
                >
                  Search Dates
                </button>
              </div>
              <div id="pastJourneys-data-container" />
              <div id="pastJourneys-pagination-container" />
              <button
                className="bl _show"
                onClick={() => {
                  window.onPastVesselJourneysExportClick();
                }}
              >
                Export Past Journeys
              </button>
            </div>
          </div>
        </div>

        <hr />
      </StyledPastJourneys>
    );
  }
}

const mapStateToProps = state => ({
  selectedVessel_data: state.ui.selectedVessel_data,
  featureClicked: state.ui.pastJourneys_featureClicked,
  pageNumber: state.ui.pastJourneyPagination_pageNumber
});

export default connect(mapStateToProps)(LeftSectionPastJourneys);

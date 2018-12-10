// function clearClicks() {
//   // clear all UI states:
//   document.body.className = "";
//   // clear all user actions:
//   onClearDistanceThresholdClick();
//   onVesselClearPredictedPortsClick();
//   map.layerManager.removePortPredictionLayer();
//   map.layerManager.removePortThresholdLayer();
//   map.clearClickOverlay();
//   onCurrentVesselJourneyClearClick();
//   onPastVesselJourneysClearClick();
//   onSelectedJourneyClearTimeSeriesClick();
// }

/***********************************************************************************
 * PORT INFO
 ************************************************************************************/

// Creates the port threshold layer and centers around the features.
function onViewDistanceThresholdClick() {
  document.body.classList.add("show-portThreshold");
  map.layerManager.removePortThresholdLayer();
  var features = map.featureManager.portDistanceThresholdFeatures.createPortDistanceThresholdFeatures();
  map.layerManager.createPortThresholdLayer(features, {});
  map.centerAroundFeatures(features);
}
// Clears the port threshold layer.
function onClearDistanceThresholdClick() {
  document.body.classList.remove("show-portThreshold");
  map.layerManager.removePortThresholdLayer();
}


/***********************************************************************************
 * PAST JOURNEYS
 ************************************************************************************/

// function onSelectedJourneyClearTimeSeriesClick() {
//   // check if plot exits
//   var plot = document.getElementById("pastJourneys_plotly");
//   if (plot.data && plot.layout) {
//     // clear it
//     map.layerManager.removeJourneyHoverPositionLayer();
//     map.layerManager.removeJourneyZoomRangeLayer();
//     Plotly.purge("pastJourneys_plotly");
//     redux_dispatch({
//       type: "CLOSE_JOURNEYTIMESERIES"
//     });
//     var currJourneyLayer = map.layerManager.getCurrentJourneyLayer();
//     if (currJourneyLayer === undefined || currJourneyLayer === null) {
//       // show the journey layers that are hidden
//       var element = $(map.getSelectedVessel() === null ? "#port-pagination-container" : "#vessel-pagination-container");
//       map.layerManager.showPastJourneysLayers(element);
//       // center around all past journeys
//       var features = map.featureManager.pastJourneysFeatures.getPastJourneyFeatures(element.pagination("getSelectedPageData"));
//       map.centerAroundFeatures(features);
//     }
//   }
// }
// 
// // Exports all journeys currently being displayed to a CSV
// function onPastPortJourneysExportClick() {
//   if (!window.rateLimitedClick) {
//     // function
//     var csv = exporter.getPastJourneyCSV();
//     var blob = new Blob([csv.data], { type: "text/csv;charset=utf-8;" });
//     var link = document.createElement("a");
//     if (link.download !== undefined) {
//       // feature detection
//       // Browsers that support HTML5 download attribute
//       var url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", csv.filename);
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//     // rate limit
//     clearTimeout(window.rateLimitedClickTimeout);
//     window.rateLimitedClick = true;
//     window.rateLimitedClickTimeout = setTimeout(function() {
//       window.rateLimitedClick = false;
//     }, 2000);
//   }
// }
// 
// function onPastPortJourneysClearClick() {
//   document.body.classList.remove("show-pastJourneys");
//   map.layerManager.removePastJourneysLayers();
//   map.layerManager.removeJourneyHoverPositionLayer();
//   map.layerManager.removeJourneyZoomRangeLayer();
//   map.featureManager.pastJourneysFeatures.clearPastJourneysTimeSeriesData();
//   Plotly.purge("pastJourneys_plotly");
//   redux_dispatch({
//     type: "CLOSE_JOURNEYTIMESERIES"
//   });
// }

/***********************************************************************************
 * PREDICTED PORTS
 ************************************************************************************/

// Clears the vessel port predictions from the sidebar.
function onVesselClearPredictedPortsClick() {
  document.body.classList.remove("show-tooltipOverlay");
  document.body.classList.remove("show-portPredictions");
  if (!$(".searchSection-ships .inputs").hasClass("disabled")) {
    map.layerManager.setVisibilityVesselLayer(true);
  }
  if (!$(".searchSection-ports .inputs").hasClass("disabled")) {
    map.layerManager.setVisibilityPortLayer(true);
  }
  map.layerManager.removePortPredictionLayer();
  map.layerManager.removePortThresholdLayer();
  map.layerManager.removePortPredictionLayer();
  map.clearClickOverlay();
}

function onVesselExportPortPredictionsClick() {
  if (!window.rateLimitedClick) {
    // function
    var csv = exporter.getVesselPortPredictionsCSV();
    var blob = new Blob([csv.data], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", csv.filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // rate limit
    clearTimeout(window.rateLimitedClickTimeout);
    window.rateLimitedClick = true;
    window.rateLimitedClickTimeout = setTimeout(function() {
      window.rateLimitedClick = false;
    }, 2000);
  }
}

/*
    After click on child or parent predicted port
*/
function onPortPredictionListClick(portId) {
  console.warn("onPortPredictionListClick", portId);
  var node = map.layerManager.getPortPredictionTreeNodeByPortId(portId);
  // hide stuff first,
  map.layerManager.hidePortPredictionTreeParentChildren(node);
  map.layerManager.hidePortPredictionTreeBelow(node);
  // then show stuff
  map.layerManager.showPortPredictionTreeChildren(node);
  // then style
  map.styleManager.determinePortPredictionLevelLineStyle();
  map.centerAroundFeatures(map.featureManager.portPredictionFeatures.getVisiblePortPredictionFeatures());
  // load port info, and...
  // dispatch to React/Redux
  var portData = node.mainFeature.get("data");
  console.log('onPortPredictionListClick() portData =',portData);
  window.redux_dispatch(uiActionCreators.createSection({section:"port", data:portData}));
  window.redux_dispatch(uiActionCreators.openSection("predictions"));
}

/*
    Initially, generate port predictions
*/
function onVesselPortPredictionClick() {
  var node = map.layerManager.getPortPredictionTree();
  map.layerManager.showPortPredictionTreeChildren(node);
  map.layerManager.hidePortPredictionTreeBelow(node);
}

/***********************************************************************************
 * SEARCH
 ************************************************************************************/

// Calls the ports endpoint and passes in the inputted filters.
function onPortSearchClick() {
  var id = $("#port-id-input").val();
  var name = $("#port-name-input").val();
  var locality = $("#port-locality-input").val();
  var admin = $("#port-area-level-input").val();
  var country = $("#port-country-input").val();
  var crudeRegion = $("#port-crude-region-search-input").val();
  var gasolineRegion = $("#port-gasoline-region-search-input").val();
  document.body.classList.add("mapLoading");
  AJAX.getPortsWithFilters(id, name, locality, admin, country, crudeRegion, gasolineRegion)
    .catch(function(error) {})
    .then(() => document.body.classList.remove("mapLoading"));
}

// Calls the vessels endpoint and passes in the inputted filters.
function onVesselSearchClick() {
  var element = $("#vessel-date-picker").data("daterangepicker"),
    startDate = element.startDate.format("YYYY-MM-DD"),
    endDate = element.endDate.format("YYYY-MM-DD"),
    imo = $("#vessel-imo-input").val(),
    flag = $("#vessel-flag-input").val(),
    deadWeightCategory = $("#vessel-dead-weight-category-input").val(),
    shipCategory = $("#vessel-ship-category-input").val(),
    operatorName = $("#vessel-operator-name-input").val();
  document.body.classList.add("mapLoading");
  AJAX.getVesselsWithFilters(startDate, endDate, imo, flag, deadWeightCategory, shipCategory, operatorName)
    .catch(function(error) {})
    .then(() => document.body.classList.remove("mapLoading"));
}

function onVesselDensitySearchClick() {
  document.body.classList.add("mapLoading");
  var element = $("#vessel-density-date-picker").data("daterangepicker");
  var startDate = element.startDate.format("YYYY-MM-DD");
  var endDate = element.endDate.format("YYYY-MM-DD");
  var journeyType = $("#vessel-density-journey-type-input").val();// parse journey type

  // FETCH DATA:
  redux_dispatch(uiActionCreators.fetchVesselsDensity(startDate, endDate, journeyType))
    .catch(() => {})
    .then(() => document.body.classList.remove("mapLoading"));
  // ORIGINAL:
  // AJAX.getVesselsDensity(startDate, endDate, journeyType)
  //   .catch(function(error) {})
  //   .then(() => document.body.classList.remove("mapLoading"));
  
  // COPY from map-ajax-interface:
  // var data = {
  //   min_date: startDate,
  //   max_date: endDate,
  //   journey_type: journeyType
  // };
  // $.get("http://localhost:5000/api/vessels/density", data, function(response) {
  //   if (response === null || response.length === 0) {
  //     alert("Vessel density not found.");
  //     return Promise.reject();
  //   }
  //   // load our times
  //   campaignClock.loadTimes(response);
  //   // create the playback slider
  //   map.createPlaybackSlider(response);
  //   // add time change listener
  //   campaignClock.addTimeChangeListener((pos, time) => {
  //     // remove the vessel density layer
  //     layerManager.removeVesselsDensityLayer();
  //     // create the features
  //     var features = featureManager.vesselsDensityFeatures.createVesselsDensityFeatures(response[pos]["points"]);
  //     // create the heatmap layer
  //     layerManager.createVesselsDensityLayer(features, {});
  //     // set new position
  //     document.getElementById("playback-input-slider").value = pos.toString();
  //   });
  //   return Promise.resolve();
  // })
}

function onRangeSliderChanged() {
  onVesselSearchClick();
  onVesselDensitySearchClick();
}

/***********************************************************************************
 * VESSEL INFO
 ************************************************************************************/
/////////////////////// Current Journey Clicks ///////////////////////////////

// Calls the endpoint to retrieve journey data
function onCurrentVesselJourneyClick() {
  // clearClicks();
  onPastVesselJourneysClearClick();
  document.body.classList.add("show-currentJourney");
  var selectedVessel = map.getSelectedVesselData();
  document.body.classList.add("mapLoading");
  AJAX.getVesselJourney(selectedVessel["imo"], selectedVessel["journey_id"])
    .catch(function(error) {})
    .then(() => document.body.classList.remove("mapLoading"));
}

// Clears the current journey layer, journey hover layer,
// journey zoom range layer, time series data, and time
// series plot.
function onCurrentVesselJourneyClearClick() {
  document.body.classList.remove("show-currentJourney");
  map.layerManager.removeCurrentJourneyLayer();
  map.layerManager.removeJourneyHoverPositionLayer();
  map.layerManager.removeJourneyZoomRangeLayer();
  map.featureManager.currentJourneyFeatures.clearCurrentJourneyTimeSeriesData();
  // Plotly.purge("pastJourneys_plotly");
  redux_dispatch({
    type: "CLOSE_JOURNEYTIMESERIES"
  });
}

/////////////////////// Past Journey Clicks ///////////////////////////////
// Calls the timeline endpoint and vessel journeys endpoint.
function onPastVesselJourneysClick() {
  // clearClicks();
  onCurrentVesselJourneyClearClick();
  // close any existing Journey Time Series
  document.body.classList.add("show-pastJourneys");
  redux_dispatch({
    type: "CLOSE_JOURNEYTIMESERIES"
  });
  // get and render all journeys
  var selectedVessel = map.getSelectedVesselData();
  document.body.classList.add("mapLoading");
  AJAX.getVesselTimeline(selectedVessel["imo"], selectedVessel["journey_id"])
    .then(AJAX.getVesselJourneys)
    .catch(function(error) {})
    .then(() => document.body.classList.remove("mapLoading"));
}

// Removes the past journeys layer, journey hover layer,
// journey zoom range layer, time series data, and plotly
// graph.
function onPastVesselJourneysClearClick() {
  document.body.classList.remove("show-pastJourneys");
  map.layerManager.removePastJourneysLayers();
  map.layerManager.removeJourneyHoverPositionLayer();
  map.layerManager.removeJourneyZoomRangeLayer();
  map.featureManager.pastJourneysFeatures.clearPastJourneysTimeSeriesData();
  // Plotly.purge("pastJourneys_plotly");
  redux_dispatch({
    type: "CLOSE_JOURNEYTIMESERIES"
  });
}

// Calls the get journeys endpoint with the appropriate start/end daste filters.
function onPastVesselJourneysSearchDatesClick() {
  document.body.classList.add("mapLoading");
  // Plotly.purge("pastJourneys_plotly");
  map.layerManager.removeJourneyZoomRangeLayer();
  map.featureManager.pastJourneysFeatures.clearPastJourneysTimeSeriesData();
  redux_dispatch({
    type: "CLOSE_JOURNEYTIMESERIES"
  });
  var selectedVessel = map.getSelectedVesselData();
  var picker = $("#vessel-past-journey-dates-picker").data("daterangepicker");
  var startDate = picker.startDate.format("YYYY-MM-DD");
  var endDate = picker.endDate.format("YYYY-MM-DD");
  var data = [selectedVessel["imo"], selectedVessel["journey_id"], startDate, endDate];
  document.body.classList.add("mapLoading");
  AJAX.getVesselJourneys(data)
    .catch(function(error) {})
    .then(() => document.body.classList.remove("mapLoading"));
}

// Exports all journeys currently being displayed to a CSV
function onPastVesselJourneysExportClick() {
  if (!window.rateLimitedClick) {
    // function
    var csv = exporter.getPastJourneyCSV();
    var blob = new Blob([csv.data], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", csv.filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    // rate limit
    clearTimeout(window.rateLimitedClickTimeout);
    window.rateLimitedClick = true;
    window.rateLimitedClickTimeout = setTimeout(function() {
      window.rateLimitedClick = false;
    }, 2000);
  }
}

// Calls the vessel prediction endpoint.
function onVesselViewPredictedPortsClick() {
  // clearClicks();
  var selectedVessel = map.getSelectedVesselData();
  document.body.classList.add("mapLoading");
  AJAX.getMockVesselPredictions(selectedVessel)
    .catch(function(error) {})
    .then(() => document.body.classList.remove("mapLoading"));
}

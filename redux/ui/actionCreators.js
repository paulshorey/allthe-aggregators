let fetchData = function(query, url) {
  return $.ajax({
    data: query,
    dataType: "json",
    url: url
  });
};

let buildQueryParametersHelper = function(keys, values) {
  var query = {};
  var size = keys.length;
  for (var i = 0; i < size; i++) {
    var key = keys[i];
    var value = values[i];
    if (typeof value == "string") {
      if (!isEmpty(value)) {
        query[key] = value.trim();
      }
    } else {
      query[key] = value;
    }
  }
  return query;
};

let fetchPortsHelper = function(parameters, url) {
  return (dispatch, getState) => {
    return fetchData(parameters, url)
      .then(function(response) {
        // remove the previous port layer being displayed
        map.layerManager.removePortsLayer();
        // create the port features and apply the port style
        var portFeatures = map.featureManager.portFeatures.createPortFeatures(response);
        // create the port layer
        map.layerManager.createPortsLayer(portFeatures, { zIndex: 1 });
        // center around port features
        map.centerAroundFeatures(portFeatures);
        // resolve
        return Promise.resolve();
      })
      .catch(error => {
        return Promise.reject();
      });
  };
};

let fetchVesselsHelper = function(parameters, url) {
  return (dispatch, getState) => {
    return fetchData(parameters, url)
      .then(response => {
        // remove the vessels layer from the map if it exists
        map.layerManager.removeVesselsLayer();
        // create the vessel features with the applied style
        let vesselFeatures = map.featureManager.vesselFeatures.createVesselFeatures(response);
        // create the vessels layer by adding it to the map
        map.layerManager.createVesselsLayer(vesselFeatures, { zIndex: 2 });
        // center around vessel features
        map.centerAroundFeatures(vesselFeatures);
        // resolve
        return Promise.resolve();
      })
      .catch(error => {
        return Promise.reject();
      });
  };
};

export const fetchPorts = () => {
  var url = "http://localhost:5000/api/ports";
  return fetchPortsHelper({}, url);
};

export const fetchPortsWithFilters = (portId, portName, locality, areaLevel, country, crudeRegion, gasolineRegion) => {
  var url = "http://localhost:5000/api/ports",
    keys = ["id", "name", "locality", "admin", "country", "crude_region", "gasoline_region"],
    values = [portId, portName, locality, areaLevel, country, crudeRegion, gasolineRegion],
    portQueryParameters = buildQueryParametersHelper(keys, values);
  return fetchPortsHelper(portQueryParameters, url);
};

export const fetchPortTimeline = () => {
  return (dispatch, getState) => {
    var idName = getState().ui.selectedPort_data.id_name;
    var url = "http://localhost:5000/api/port/" + idName + "/timeline";
    return fetchData({}, url)
      .then(function(response) {
        if (response["status"] === "failed") {
          alert("No past journeys for port " + idName);
          
          // close old timeseries
          map.layerManager.removePastJourneysLayers();
          map.layerManager.removeJourneyHoverPositionLayer();
          map.layerManager.removeJourneyZoomRangeLayer();
          map.featureManager.pastJourneysFeatures.clearPastJourneysTimeSeriesData();
          Plotly.purge("pastJourneys_plotly");
          redux_dispatch({
            type: "CLOSE_JOURNEYTIMESERIES"
          });

          return Promise.reject();
        } else {
          var startDate = response["min_date"].split(" ")[0];
          var endDate = response["max_date"].split(" ")[0];
          var picker = $("#pastJourneys_datePicker");
          map.createJourneyDateRangePicker(response, picker);
          return Promise.resolve([idName, startDate, endDate]);
        }
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };
};

export const portUpdateRegions = inputs => {
  return (dispatch, getState) => {
    var portData = map.getSelectedPortData();
    if (!isEmpty(inputs.crude_region) && !isEmpty(inputs.gasoline_region)) {
      // update map
      portData["crude_region"] = inputs.crude_region;
      portData["gasoline_region"] = inputs.gasoline_region;
      map.getSelectedPort().set("data", portData);
      // update server
      $.ajax({
        type: "PUT",
        url: "http://localhost:5000/api/port/" + portData["id_name"],
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify({
          crude_region: inputs.crude_region,
          gasoline_region: inputs.gasoline_region
        }),
        success: function(data) {
          if (data == null) return;
          console.log("AjaxInterface.updatePort.success: Updating port...");
          alert("Success: Updated port info.");
        },
        error: function(error) {
          console.log("AjaxInterface.updatePort.error: " + error.responseText);
          return false;
        }
      });
    } else {
      alert("Failed: Could not update port info.");
    }
  };
};

export const fetchVessels = data => {
  var url = "http://localhost:5000/api/vessels";
  var keys = ["min_date", "max_date"];
  var values = [data[0], data[1]];
  var vesselQueryParameters = buildQueryParametersHelper(keys, values);
  return fetchVesselsHelper(vesselQueryParameters, url);
};

export const fetchVesselsWithFilters = (startDate, endDate, imo, flag, deadWeightCategory, shipCategory, operatorName) => {
  var url = "http://localhost:5000/api/vessels",
    keys = ["min_date", "max_date", "imo", "flag", "dead_weight_category", "ship_category", "operator_name"],
    values = [startDate, endDate, imo, flag, deadWeightCategory, shipCategory, operatorName],
    vesselQueryParameters = buildQueryParametersHelper(keys, values);
  return fetchVesselsHelper(vesselQueryParameters, url);
};

export const fetchCurrentJourney = function() {
  return function(dispatch, getState) {
    var selectedVessel = getState().ui.selectedVessel_data;
    var url = "http://localhost:5000/api/vessel/" + selectedVessel["imo"] + "/" + selectedVessel["journey_id"];
    return fetchData({}, url)
      .then(response => {
        dispatch({
          type: "VIEW_CURRENT_JOURNEY"
        });
        // remove past journey layers
        map.layerManager.removePastJourneysLayers();
        // remove port predictions
        map.layerManager.removePortPredictionLayer();
        // toggle the layers
        toggleLayers(getState());
        // retrieve the current journey style
        var currentJourneyStyles = map.styleManager.getCurrentJourneyStyles();
        // create the current journey features
        var currentJourneyFeatures = map.featureManager.currentJourneyFeatures.createCurrentJourneyFeatures(response, currentJourneyStyles);
        // create the current journey layer
        map.layerManager.createCurrentJourneyLayer(currentJourneyFeatures, {});
        // center the map around the journey
        map.centerAroundFeatures(currentJourneyFeatures);
        // resolve
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.reject();
      });
  };
};


export const portMetrics = function(args) {
  return (dispatch, getState) => {
    // parse arguments
    var { port_name } = args;

    // un-set
    if (!args) {
      dispatch({
        type: "PORT_METRICS_DATA",
        data: {}
      });
      return;
    }

    // fetch new data, then set
    document.body.classList.add("mapLoading");
    var portId = getState().ui.selectedPort_data.id_name;
    var url = "http://localhost:5000/api/port/" + portId;
    $.get(url, function(data) {
      if (data["date"].length !== 0) {
        console.warn(url,data);
        /*
          open modal
        */
        data.port_name = port_name;
        dispatch({
          type: "PORT_METRICS_DATA",
          data: data
        });
      }
    })
    // error
    .fail(function(jqXHR, textStatus, error) {
      console.log("AjaxInterface.getCountryMetrics.error: " + error);
    })
    .always(function() {
      document.body.classList.remove("mapLoading");
    });
  };
};


export const countryMetrics = function(args) {
  return (dispatch, getState) => {
    // original map.js also had:
    // clickOverlayShowing = true;
    // selectedRegion = feature;
    var {country_name, coordinate, overlay, feature, content} = args;

    // un-set
    if (!args) {
      dispatch({
        type: "COUNTRY_METRICS_DATA",
        data: {}
      });
      return;
    }

    // fetch new data, then set
    document.body.classList.add("mapLoading");
    var url = "http://localhost:5000/api/country/" + country_name;
    $.get(url, function(data) {
      // success
      if (data["date"].length !== 0) {
        
        // redux
        data.country_name = country_name;
        dispatch({
          type: "COUNTRY_METRICS_DATA",
          data: data
        });

      } else {
        alert("No volume metrics for country " + country_name);
      }
    })
    // error
    .fail(function(jqXHR, textStatus, error) {
      console.log("AjaxInterface.getCountryMetrics.error: " + error);
    })
    .always(function() {
      document.body.classList.remove("mapLoading");
    });
  }
};

export const portPrediction_auditTrail = function(args) {
  return (dispatch, getState) => {

    // un-set
    if (!args) {
      dispatch({
        type: "AUDIT_TRAIL_DATA",
        data: {}
      });
      return;
    }

    // fetch new data, then set
    dispatch({
      type: "AUDIT_TRAIL_DATA",
      data: {
        placeholderValue: Date.now()
      }
    });

  }
};

export const fetchPortMetrics = function() {
  return (dispatch, getState) => {
    var portId = getState().ui.selectedPort_data.port_id;
    var url = "/api/port/" + portId;
    return fetchData({}, url)
      .then(response => {
        if (response["date"].length !== 0) {
          dispatch({
            type: "PORT_METRICS_DATA",
            data: response
          });
        } else {
          // Uh oh, no data
        }
        return Promise.resolve();
      })
      .catch(() => Promise.reject());
  };
};

export const fetchCountryMetrics = function(countryName) {
  return (dispatch, getState) => {
    var url = "/api/country/" + countryName;
    return fetchData({}, url)
      .then(response => {
        if (response["date"].length !== 0) {
          dispatch({
            type: "COUNTRY_METRICS_DATA",
            data: response
          });
        } else {
          // Uh oh, no data
        }
        // if (data['date'].length !== 0) {
        //   map.showRegionClickOverlay(data, coordinate, overlay, feature, content);
        // } else {
        //     alert("No volume metrics for country " + countryName);
        // }
        return Promise.resolve();
      })
      .catch(error => Promise.reject());
  };
};

export const fetchVesselPastJourneys = function(data) {
  return function(dispatch, getState) {
    var imo = data[0],
      journeyId = data[1],
      minDate = data[2],
      maxDate = data[3],
      keys = ["journey_id", "start_date", "end_date"],
      values = [journeyId, minDate, maxDate],
      journeyQueryParameters = buildQueryParametersHelper(keys, values),
      url = "http://localhost:5000/api/vessel/" + imo + "/journeys";
    return fetchData(journeyQueryParameters, url)
      .then(function(response) {
        // create the features and add them to the map
        map.featureManager.pastJourneysFeatures.createPastJourneyFeatures(response);
        // create our csv data in case the user wants to export it
        exporter.convertPastJourneyDataToCSV(response, imo, minDate, maxDate);
        // open section
        dispatch(createSection({section:"pastJourneys", pastJourneys_featureClicked:"vessel"}));
        return Promise.resolve();
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };
};

export const fetchPortPastJourneys = function(data) {
  return function(dispatch, getState) {
    var idName = data[0],
      startDate = data[1],
      endDate = data[2],
      keys = ["start_date", "end_date"],
      values = [startDate, endDate],
      portJourneyQueryParams = buildQueryParametersHelper(keys, values),
      url = "http://localhost:5000/api/port/" + idName + "/journeys";
    return fetchData(portJourneyQueryParams, url)
      .then(response => {
        // remove all past journey layers from the map
        map.layerManager.removePastJourneysLayers();
        // create the features and add them to the map
        map.featureManager.pastJourneysFeatures.createPastJourneyFeatures(response);
        // create our csv data in case the user wants to export it
        exporter.convertPastJourneyDataToCSV(data, idName, startDate, endDate);
        // open section
        redux_dispatch(createSection({section:"pastJourneys", pastJourneys_featureClicked:"port"}));
        return Promise.resolve();
      })
      .catch(error => {
        return Promise.reject();
      });
  };
};

// we arent making any dispatch actions to the store yet
export const fetchVesselTimeline = function() {
  return (dispatch, getState) => {
    var selectedVessel = getState().ui.selectedVessel_data;
    var url = "http://localhost:5000/api/vessel/" + selectedVessel.imo + "/timeline";
    return fetchData({}, url)
      .then(function(response) {
        var minDate = response["min_date"].split(" ")[0];
        var maxDate = response["max_date"].split(" ")[0];
        var startDate = response["min_date"].split(" ")[0];
        var endDate = response["max_date"].split(" ")[0];
        var picker = $("#pastJourneys_datePicker");
        map.createJourneyDateRangePicker(response, picker);
        return Promise.resolve([selectedVessel.imo, selectedVessel.journey_id, minDate, maxDate]);
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  };
};

export const fetchVesselsDensity = function(minDate, maxDate, journeyType) {
  return function(dispatch, getState) {
    var keys = ["min_date", "max_date", "journey_type"],
      values = [minDate, maxDate, journeyType],
      densityQueryParameters = buildQueryParametersHelper(keys, values);
    return fetchData(densityQueryParameters, "http://localhost:5000/api/vessels/density")
      .then(function(response) {
        // load our times
        campaignClock.loadTimes(response);
        // create the playback slider
        dispatch({
          type: "VESSELS_DENSITY_PLAYBACK_SLIDER_LENGTH",
          length: response.length
        });
        // add time change listener
        campaignClock.addTimeChangeListener((pos, time) => {
          // remove the vessel density layer
          map.layerManager.removeVesselsDensityLayer();
          // create the features
          var features = map.featureManager.vesselsDensityFeatures.createVesselsDensityFeatures(response[pos]["points"]);
          // create the heatmap layer
          map.layerManager.createVesselsDensityLayer(features, {});
          // set new position
          document.getElementById("playback-input-slider").value = pos.toString();
        });
        return Promise.resolve();
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };
};

export const onLoad = function() {
  return dispatch => {
    return dispatch(fetchAllVesselsTimeline())
      .then(response => dispatch(fetchVessels(response)))
      .then(dispatch(fetchPorts()));
  };
};

/**
 * Right now this isnt dispatching any actions, its simply doing an AJAX call; however,
 * it can remain here until we figure out what actions it will be dispatching to the store.
 */
export const fetchAllVesselsTimeline = function() {
  return function(dispatch, getState) {
    return fetchData({}, "http://localhost:5000/api/vessels/timeline")
      .then(response => {
        map.createVesselDateRangePicker(response, $("#vessel-date-picker"));
        map.createVesselDateRangePicker(response, $("#vessel-density-date-picker"), "up");

        var maxDateStr = response["max_date"].split(" ")[0],
          weekBeforeMaxDate = new Date(maxDateStr);

        weekBeforeMaxDate.setDate(weekBeforeMaxDate.getDate() - 7);

        var weekBeforeMaxDateYear = weekBeforeMaxDate.getFullYear(),
          weekBeforeMaxDateMonth = weekBeforeMaxDate.getMonth() + 1,
          weekBeforeMaxDateDay = weekBeforeMaxDate.getDate(),
          weekBeforeMaxDateStr = weekBeforeMaxDateYear + "-" + weekBeforeMaxDateMonth + "-" + weekBeforeMaxDateDay;

        return Promise.resolve([weekBeforeMaxDateStr, maxDateStr]);
      })
      .catch(function() {
        return Promise.reject();
      });
  };
};

export const fetchMockPredictions = () => {
  return (dispatch, getState) => {
    var vesselData = getState().ui.selectedVessel_data;
    var url = "http://localhost:5000/api/vessel/" + vesselData["imo"] + "/mockpredictions";
    return fetchData({}, url)
      .then(function(response) {
        vesselData["volume"] = response["volume"];
        vesselData["cargo_owner"] = response["cargo_owner"];
        vesselData["cargo_charterer"] = response["cargo_charterer"];
        vesselData["cargo_grade"] = response["cargo_grade"];
        map.createVesselPredictionTree(response["port_predictions"]);
        exporter.convertVesselPortPredictionDataToCSV(response["port_predictions"], vesselData["imo"]);
        redux_dispatch(createSection({section:"predictions"}));
        return Promise.resolve();
      })
      .catch(() => {
        return Promise.reject();
      });
  };
};

export const clearCurrentJourney = function() {
  return function(dispatch, getState) {
    dispatch(journeyTimeSeries_close());
    dispatch({
      type: "CLEAR_CURRENT_JOURNEY"
    });
    map.layerManager.removeCurrentJourneyLayer();
    map.layerManager.removeJourneyHoverPositionLayer();
    map.layerManager.removeJourneyZoomRangeLayer();
    map.featureManager.currentJourneyFeatures.clearCurrentJourneyTimeSeriesData();
  };
};

export const searchSectionEnable = function(section, enabled) {
  return function(dispatch, getState) {
    // ui
    dispatch({
      type: "SEARCH_SECTION_ENABLE",
      section: section,
      enabled: enabled
    });
    // map
    switch (section) {
      case "ships":
        map.layerManager.setVisibilityVesselLayer(enabled);
        break;
      case "ports":
        map.layerManager.setVisibilityPortLayer(enabled);
        break;
      case "countries":
        map.layerManager.setVisibilityCountriesLayer(enabled);
        break;
      case "crude_regions":
        map.layerManager.setVisibilityCrudeRegionsLayer(enabled);
        break;
      case "vessel_density":
        map.layerManager.setVisibilityVesselDensityLayer(enabled || false);
        if (enabled) {
          var layer = map.layerManager.getVesselDensityLayer();
          if (layer === undefined || layer === null) {
            onVesselDensitySearchClick();
          }
        }
        break;
    }
  };
};

export const createSection = function(dispatchData) {
  return function(dispatch, getState) {
    // ui
    dispatchData.type = "CREATE_SECTION";
    dispatch(dispatchData);
    // map
    switch (dispatchData.section) {
      case "ship":
        map.layerManager.removeJourneyHoverPositionLayer();
        map.layerManager.removeJourneyZoomRangeLayer();
        map.layerManager.removePortThresholdLayer();
        map.layerManager.removePastJourneysLayers();
        map.layerManager.removeCurrentJourneyLayer();
        break;
      case "port":
        map.layerManager.removeJourneyHoverPositionLayer();
        map.layerManager.removeJourneyZoomRangeLayer();
        map.layerManager.removePortThresholdLayer();
        map.layerManager.removePastJourneysLayers();
        map.layerManager.removeCurrentJourneyLayer();
        // map.layerManager.removePortPredictionLayer();
        break;
      case "pastJourneys":
        // vessel section past journeys, remove the following layers
        map.layerManager.removeCurrentJourneyLayer();
        map.layerManager.removePortPredictionLayer();
        map.layerManager.removeJourneyHoverPositionLayer();
        map.layerManager.removeJourneyZoomRangeLayer();
        // port section past journeys, remove the following layer
        map.layerManager.removePortThresholdLayer();
        // check search section toggles to ensure we toggle on only the layers that
        // were previously set to visible
        toggleLayers(getState());
        break;
      case "predictions":
        map.layerManager.removeCurrentJourneyLayer();
        map.layerManager.removePastJourneysLayers();
        map.layerManager.removeJourneyHoverPositionLayer();
        map.layerManager.removeJourneyZoomRangeLayer();
        break;
    }
  };
};

export const openSection = function(whatSection) {
  return function(dispatch, getState) {
    // ui
    dispatch({
      type: "OPEN_SECTION",
      section: whatSection
    });
    // map
    switch (whatSection) {
      case "search":
        // opening the search section is equivalent to starting over,
        // thus we must remove all layers on the map that are not available
        // in the toggle section
        map.layerManager.removeJourneyHoverPositionLayer();
        map.layerManager.removeJourneyZoomRangeLayer();
        map.layerManager.removePortThresholdLayer();
        map.layerManager.removePastJourneysLayers();
        map.layerManager.removeCurrentJourneyLayer();
        map.layerManager.removePortPredictionLayer();
        // check search section toggles to ensure we toggle on only the layers that
        // were previously set to visible
        toggleLayers(getState());
        break;
      case "toggle":
        break;
      case "ship":
        break;
      case "port":
        break;
      case "pastJourneys":
        break;
      case "predictions":
        break;
      case "metrics":
        break;
    }
  };
};

export const closeSection = function(whatSection) {
  return function(dispatch, getState) {
    // map
    switch (whatSection) {
      case "ship":
        // If we are closing a ship section, we need to ensure other layers
        // that rely on the ship section are removed as well.
        // Layers that must be removed:
        //    1) Current Journey Layer
        //    2) Past Journey Layers
        //    3) Port Prediction Layers
        //    4) Journey Hover Layer
        //    5) Journey Zoom Range Layer
        map.layerManager.removeCurrentJourneyLayer();
        map.layerManager.removePastJourneysLayers();
        map.layerManager.removePortPredictionLayer();
        map.layerManager.removeJourneyHoverPositionLayer();
        map.layerManager.removeJourneyZoomRangeLayer();
        // if we are attempting to close the ship section with the prediction window open,
        // we need to change the visibility of the map layers
        if (getState().ui.leftSections_enabled.has("predictions")) {
          toggleLayers(getState());
        }
        map.clearSelectedVessel();
        break;
      case "port":
        // If we are closing the port section, we need to remove the following layers
        //    1) Distance Threshold Layer
        //    2) Past Journey Layers
        map.layerManager.removePortThresholdLayer();
        map.layerManager.removePastJourneysLayers();
        map.clearSelectedPort();
        break;
      case "pastJourneys":
        // Remove the past journey layers if we are closing the section
        map.layerManager.removePastJourneysLayers();
      case "predictions":
        // Remove port prediction layer
        map.layerManager.removePortPredictionLayer();
        // check search section toggles to ensure we toggle on only the layers that
        // were previously set to visible
        toggleLayers(getState());
        break;
    }
    // ui
    dispatch({
      type: "CLOSE_SECTION",
      section: whatSection
    });
  };
};


export const portPredictions_node = function(node) {
  return (dispatch, getState) => {
    // Modify the tree based on the node clicked.
    map.layerManager.showPortPredictionTreeChildren(node);
    map.layerManager.hidePortPredictionTreeParentChildren(node);
    map.layerManager.hidePortPredictionTreeBelow(node);
    map.styleManager.determinePortPredictionLevelLineStyle();
    // Center around all of the visible port prediction tree features
    map.centerAroundFeatures(map.featureManager.portPredictionFeatures.getVisiblePortPredictionFeatures());
    // If it is not the same feature as the currently selected port,
    // display the data of the port prediction port
    var portData = node.mainFeature.get("data");
    // Redux action
    // create port_prediction section
    dispatch(createSection({section:"portPrediction", data:portData}));
    // open predictions
    dispatch(createSection({section:"predictions", portPredictions_selectedNode_uniqueId:node.uniqueId }));
  }
}

export const portThreshold_remove = function() {
  return (dispatch, getState) => {
    map.layerManager.removePortThresholdLayer();
    dispatch({
      type: "CLEAR_PORT_THRESHOLD"
    });
  };
};

export const portThreshold_create = function() {
  return (dispatch, getState) => {
    map.layerManager.removePortThresholdLayer();
    var features = map.featureManager.portDistanceThresholdFeatures.createPortDistanceThresholdFeatures();
    map.layerManager.createPortThresholdLayer(features, {});
    map.centerAroundFeatures(features);
    dispatch({
      type: "VIEW_PORT_THRESHOLD"
    });
  };
};

export const journeyTimeSeries_create = function(data) {
  return {
    type: "JOURNEYTIMESERIES_DATA",
    data: data
  };
};

export const journeyTimeSeries_close = function() {
  return {
    type: "JOURNEYTIMESERIES_DATA",
    data: {}
  };
};

export const pastJourney_select = function(pageNumber) {
  return {
    type: "PASTJOURNEY_SELECT",
    pageNumber: pageNumber
  };
};

function toggleLayers(state) {
  // check search section toggles to ensure we toggle on only the layers that
  // were previously set to visible
  var searchSections = state.ui.searchSections_enabled;
  if (searchSections.has("ships")) map.layerManager.setVisibilityVesselLayer(true);
  if (searchSections.has("ports")) map.layerManager.setVisibilityPortLayer(true);
  if (searchSections.has("countries")) map.layerManager.setVisibilityCountriesLayer(true);
  if (searchSections.has("vessel_density")) map.layerManager.setVisibilityVesselDensityLayer(true);
}

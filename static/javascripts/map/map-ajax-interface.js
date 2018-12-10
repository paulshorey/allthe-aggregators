////////////////////////////////////////////////
// AJAX client-to-server communication layer. //
////////////////////////////////////////////////

function MapAjaxInterface(map) {
  // The meaning of "this" changes during callbacks, so save its original value
  let that = this;

  let _fetchData = function(query, url) {
    return $.ajax({
      data: query,
      dataType: "json",
      url: url
    });
  };

  let _buildQueryParametersHelper = function(keys, values) {
    var query = {},
      size = keys.length;
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

  // Executes an AJAX call to load all ports with the various parameters.
  let _getPortsHelper = function(response) {
    if (response === null || response.length == 0) {
      alert("No ports found!");
      return Promise.reject();
    }
    // remove the previous port layer being displayed
    layerManager.removePortsLayer();
    // create the port features and apply the port style
    var portFeatures = featureManager.portFeatures.createPortFeatures(response);
    // create the port layer
    layerManager.createPortsLayer(portFeatures, { zIndex: 1 });
    // center around port features
    map.centerAroundFeatures(portFeatures);
    return Promise.resolve();
  };

  // Executes an AJAX call to get all vessels based on the query parameters
  let _getVesselsHelper = function(response) {
    if (response === null || response.length == 0) {
      alert("No vessels found!");
      return Promise.reject();
    }
    // remove the vessels layer from the map if it exists
    layerManager.removeVesselsLayer();
    // create the vessel features with the applied style
    var vesselFeatures = featureManager.vesselFeatures.createVesselFeatures(response);
    // create the vessels layer by adding it to the map
    layerManager.createVesselsLayer(vesselFeatures, { zIndex: 2 });
    // center around vessel features
    map.centerAroundFeatures(vesselFeatures);
    return Promise.resolve();
  };

  // Executes an AJAX call to poll the import/export metrics of a country
  this.getCountryMetrics = function(countryName, coordinate, overlay, feature, content) {
    var url = "http://localhost:5000/api/country/" + countryName,
      countryMetricAjax = _fetchData({}, url);

    countryMetricAjax
      .done(function(data) {
        console.log("AjaxInterface.getCountryMetrics.success: Retrieved country metrics...");
        if (data["date"].length !== 0) {
          map.showRegionClickOverlay(data, coordinate, overlay, feature, content);
        } else {
          alert("No volume metrics for country " + countryName);
        }
      })
      .fail(function(jqXHR, textStatus, error) {
        console.log("AjaxInterface.getCountryMetrics.error: " + error);
      })
      .always(function() {
        document.body.classList.remove("mapLoading");
      });
  };

  // Executes an AJAX call to retrieve import/export metrics for a port
  this.getPortMetrics = function(portId) {
    window.reset_port_metrics();

    var url = "http://localhost:5000/api/port/" + portId,
      portMetrics = _fetchData({}, url);

    portMetrics
      .done(function(data) {
        if (data["date"].length !== 0) {
          map.createImportExportPlot(data, portId, document.getElementById("port-plot"), {
            width: 430,
            height: 300
          });
        } else {
          document.getElementById("port-plot").innerHTML = "<h5>No data found.</h5>";
        }
      })
      .fail(function(jqXHR, textStatus, error) {
        console.log("AjaxInterface.getPortMetrics.error: " + error);
      })
      .always(function() {
        document.body.classList.remove("mapLoading");
      });
  };

  // Executes an AJAX call to update the contents of the clicked on port
  this.updatePort = function(portId, crudeRegion, gasolineRegion) {
    $.ajax({
      type: "PUT",
      url: "http://localhost:5000/api/port/" + portId,
      contentType: "application/json;charset=UTF-8",
      data: JSON.stringify({
        crude_region: crudeRegion,
        gasoline_region: gasolineRegion
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
    return true;
  };

  this.getVesselsWithFilters = function(minDate, maxDate, imo, flag, deadWeightCategory, shipCategory, operatorName) {
    var keys = ["min_date", "max_date", "imo", "flag", "dead_weight_category", "ship_category", "operator_name"],
      values = [minDate, maxDate, imo, flag, deadWeightCategory, shipCategory, operatorName],
      vesselQueryParameters = _buildQueryParametersHelper(keys, values);
    return _fetchData(vesselQueryParameters, "http://localhost:5000/api/vessels")
      .then(function(response) {
        return _getVesselsHelper(response);
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getVessels = function(dates) {
    var keys = ["min_date", "max_date"],
      values = [dates[0], dates[1]],
      vesselQueryParameters = _buildQueryParametersHelper(keys, values);
    return _fetchData(vesselQueryParameters, "http://localhost:5000/api/vessels")
      .then(function(response) {
        return _getVesselsHelper(response);
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getVesselsDensity = function(minDate, maxDate, journeyType) {
    var keys = ["min_date", "max_date", "journey_type"],
      values = [minDate, maxDate, journeyType],
      densityQueryParameters = _buildQueryParametersHelper(keys, values);
    return _fetchData(densityQueryParameters, "http://localhost:5000/api/vessels/density")
      .then(function(response) {
        if (response === null || response.length === 0) {
          alert("Vessel density not found.");
          return Promise.reject();
        }
        // load our times
        campaignClock.loadTimes(response);
        // create the playback slider
        map.createPlaybackSlider(response);
        // add time change listener
        campaignClock.addTimeChangeListener((pos, time) => {
          // remove the vessel density layer
          layerManager.removeVesselsDensityLayer();
          // create the features
          var features = featureManager.vesselsDensityFeatures.createVesselsDensityFeatures(response[pos]["points"]);
          // create the heatmap layer
          layerManager.createVesselsDensityLayer(features, {});
          // set new position
          document.getElementById("playback-input-slider").value = pos.toString();
        });
        return Promise.resolve();
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getAllVesselsTimeline = function() {
    return _fetchData({}, "http://localhost:5000/api/vessels/timeline")
      .then(function(response) {
        if (response === null || response.length === 0) {
          alert("Vessels timeline not found.");
          return Promise.reject();
        }
        var vesselPicker = $("#vessel-date-picker"),
          vesselDensityPicker = $("#vessel-density-date-picker");
        map.createVesselDateRangePicker(response, vesselPicker);
        map.createVesselDateRangePicker(response, vesselDensityPicker, true);

        var maxDateStr = response["max_date"].split(" ")[0],
          weekBeforeMaxDate = new Date(maxDateStr);

        weekBeforeMaxDate.setDate(weekBeforeMaxDate.getDate() - 7);

        var weekBeforeMaxDateYear = weekBeforeMaxDate.getFullYear(),
          weekBeforeMaxDateMonth = weekBeforeMaxDate.getMonth() + 1,
          weekBeforeMaxDateDay = weekBeforeMaxDate.getDate(),
          weekBeforeMaxDateStr = weekBeforeMaxDateYear + "-" + weekBeforeMaxDateMonth + "-" + weekBeforeMaxDateDay;

        return Promise.resolve([weekBeforeMaxDateStr, maxDateStr]);
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  };

  this.getVesselTimeline = function(imo, journeyId) {
    var url = "http://localhost:5000/api/vessel/" + imo + "/timeline";
    return _fetchData({}, url)
      .then(function(response) {
        if (response === null || response.length === 0) {
          alert("No vessel timeline found!");
          return Promise.reject();
        }
        var minDate = response["min_date"].split(" ")[0];
        var maxDate = response["max_date"].split(" ")[0];
        var picker = $("#vessel-past-journey-date-picker");
        map.createJourneyDateRangePicker(response, picker);
        return Promise.resolve([imo, journeyId, minDate, maxDate]);
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  };

  this.getPortTimeline = function(idName) {
    var url = "http://localhost:5000/api/port/" + idName + "/timeline";
    return _fetchData({}, url)
      .then(function(response) {
        if (response["status"] === "failed") {
          alert("No past journeys for port " + idName);
          onPastPortJourneysClearClick();
          return Promise.reject();
        } else {
          var startDate = response["min_date"].split(" ")[0];
          var endDate = response["max_date"].split(" ")[0];
          var picker = $("#port-past-journey-date-picker");
          map.createJourneyDateRangePicker(response, picker);
          return Promise.resolve([idName, startDate, endDate]);
        }
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  // this.getPortJourneys = function(data) {
  //   if (window.logEnabled) {
  //     console.log("map-ajax-interface.js    this.getPortJourneys()");
  //   }
  //   var idName = data[0],
  //     startDate = data[1],
  //     endDate = data[2],
  //     keys = ["start_date", "end_date"],
  //     values = [startDate, endDate],
  //     portJourneyQueryParams = _buildQueryParametersHelper(keys, values),
  //     url = "http://localhost:5000/api/port/" + idName + "/journeys";
  //   return _fetchData(portJourneyQueryParams, url)
  //     .then(function(response) {
  //       if (response === null || response.length === 0) {
  //         alert("No port past journeys found!");
  //         return Promise.reject();
  //       }
  //       // remove all past journey layers from the map
  //       layerManager.removePastJourneysLayers();
  //       // create the features and add them to the map
  //       featureManager.pastJourneysFeatures.createPastJourneyFeatures(response);
  //       // create our pagination container
  //       map.createPastJourneyPaginationContainer($("#port-pagination-container"), $("#port-data-container"));
  //       // create our csv data in case the user wants to export it
  //       exporter.convertPastJourneyDataToCSV(data, idName, startDate, endDate);
  //       return Promise.resolve();
  //     })
  //     .catch(function(error) {
  //       return Promise.reject();
  //     });
  // };

  // this.getVesselJourneys = function(data) {
  //   if (window.logEnabled) {
  //     console.log("map-ajax-interface.js    this.getVesselJourneys()");
  //   }
  //   var imo = data[0],
  //     journeyId = data[1],
  //     minDate = data[2],
  //     maxDate = data[3],
  //     keys = ["journey_id", "start_date", "end_date"],
  //     values = [journeyId, minDate, maxDate],
  //     journeyQueryParameters = _buildQueryParametersHelper(keys, values),
  //     url = "http://localhost:5000/api/vessel/" + imo + "/journeys";
  //   return _fetchData(journeyQueryParameters, url)
  //     .then(function(response) {
  //       if (response === null || response.length === 0) {
  //         alert("No past journeys found!");
  //         return Promise.reject();
  //       }
  //       // remove all past journey layers from the map
  //       layerManager.removePastJourneysLayers();
  //       // create the features and add them to the map
  //       featureManager.pastJourneysFeatures.createPastJourneyFeatures(response);
  //       // create our pagination container
  //       map.createPastJourneyPaginationContainer($("#vessel-pagination-container"), $("#vessel-data-container"));
  //       // create our csv data in case the user wants to export it
  //       exporter.convertPastJourneyDataToCSV(response, imo, minDate, maxDate);
  //       return Promise.resolve();
  //     })
  //     .catch(function(error) {
  //       return Promise.reject();
  //     });
  // };

  this.getVesselJourney = function(imo, journeyId) {
    var url = "http://localhost:5000/api/vessel/" + imo + "/" + journeyId;
    return _fetchData({}, url)
      .then(function(response) {
        if (response === null || response.length === 0) {
          alert("No current journey!");
          return Promise.reject();
        }
        // remove the previous current journey layer that was displayed
        layerManager.removeCurrentJourneyLayer();
        // retrieve the current journey style
        var currentJourneyStyles = styleManager.getCurrentJourneyStyles();
        // create the current journey features
        var currentJourneyFeatures = featureManager.currentJourneyFeatures.createCurrentJourneyFeatures(response, currentJourneyStyles);
        // create the current journey layer
        layerManager.createCurrentJourneyLayer(currentJourneyFeatures, {});
        // center the map around the journey
        map.centerAroundFeatures(currentJourneyFeatures);
        return Promise.resolve();
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getMockVesselPredictions = function(vesselData) {
    var url = "http://localhost:5000/api/vessel/" + vesselData["imo"] + "/mockpredictions";
    return _fetchData({}, url)
      .then(function(response) {
        vesselData["volume"] = response["volume"];
        vesselData["cargo_owner"] = response["cargo_owner"];
        vesselData["cargo_charterer"] = response["cargo_charterer"];
        vesselData["cargo_grade"] = response["cargo_grade"];
        console.log("getMockVesselPredictions", response);
        map.createVesselPredictionTree(response["port_predictions"]);
        exporter.convertVesselPortPredictionDataToCSV(response["port_predictions"], vesselData["imo"]);
        return Promise.resolve();
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getPredictions = function(vesselData) {
    var vesselImo = vesselData["imo"],
      // cargo owner vars
      cargoOwnerKeys = ["load_port_id"],
      cargoOwnerValues = [vesselData["c_start_port_id"]],
      cargoOwnerQueryParameters = _buildQueryParametersHelper(cargoOwnerKeys, cargoOwnerValues),
      cargoOwnerUrl = "http://localhost:5000/api/vessel/" + vesselImo + "/cargoowner",
      // volume vars
      volumeKeys = ["max_draft", "gross_ton", "fluid_cap", "beam", "dead_wt_cat", "load_port_id"],
      volumeValues = [vesselData["max_draft"], vesselData["gross_ton"], vesselData["fluid_cap"], vesselData["beam"], vesselData["dead_wt_cat"], vesselData["c_start_port_id"]],
      volumeQueryParameters = _buildQueryParametersHelper(volumeKeys, volumeValues),
      volumeUrl = "http://localhost:5000/api/vessel/gasoline/" + vesselImo + "/volume",
      // vessel prediction vars
      vesselPredictionKeys = ["imo", "start_port_id", "lat", "lon", "flag_code"],
      vesselPredictionValues = [vesselImo, vesselData["c_start_port_id"], vesselData["lat"], vesselData["lon"], vesselData["flag"]],
      vesselPredictionQueryParameters = _buildQueryParametersHelper(vesselPredictionKeys, vesselPredictionValues),
      vesselPredictionUrl = "http://localhost:5000/api/vessel/" + vesselImo + "/predictions";

    $.when(_fetchData(volumeQueryParameters, volumeUrl), _fetchData(cargoOwnerQueryParameters, cargoOwnerUrl), _fetchData(vesselPredictionQueryParameters, vesselPredictionUrl))
      .done(function(volume, cargoOwner, vesselPrediction) {
        console.log("AjaxInterface.getPredictions.success: Retrieving predictions...");

        // volume logic
        vesselData["volume"] = volume[0]["prediction"] + " (bbls)";

        // cargo owner logic
        vesselData["cargo_owner"] = cargoOwner[0]["prediction"];

        // vessel prediction logic
        map.createVesselPredictionTree(vesselPrediction[0]);
        exporter.convertVesselPortPredictionDataToCSV(vesselPrediction[0], vesselImo);
      })
      .fail(function(volume, cargoOwner, vesselPrediction) {
        console.log("AjaxInterface.getPredictions.error");
      })
      .always(function() {
        document.body.classList.remove("mapLoading");
      });
  };

  this.getVesselsPredictions = function() {
    return _fetchData({}, "http://localhost:5000/api/vessels/predictions")
      .then(function(response) {
        var csv = exporter.convertAllPortPredictionDataToCSV(response);
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
        return Promise.resolve();
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getPortsWithFilters = function(portId, portName, locality, areaLevel, country, crudeRegion, gasolineRegion) {
    var keys = ["id", "name", "locality", "admin", "country", "crude_region", "gasoline_region"],
      values = [portId, portName, locality, areaLevel, country, crudeRegion, gasolineRegion],
      portQueryParameters = _buildQueryParametersHelper(keys, values);
    return _fetchData(portQueryParameters, "http://localhost:5000/api/ports")
      .then(function(response) {
        return _getPortsHelper(response);
      })
      .catch(function(error) {
        return Promise.reject();
      });
  };

  this.getPorts = function() {
    return _fetchData({}, "http://localhost:5000/api/ports")
      .then(function(response) {
        return _getPortsHelper(response);
      })
      .catch(function(error) {
        return Promise.reject(error);
      });
  };
}

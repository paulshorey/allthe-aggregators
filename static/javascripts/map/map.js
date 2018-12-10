// Holds a reference to the OpenLayers map object.
// The map is initialized here along with different
// popup control logic.
function OurMap(styleManager, featureManager, layerManager) {
  // Make publically-accessible (temporary? what's the best way to do this?)
  this.styleManager = styleManager;
  this.featureManager = featureManager;
  this.layerManager = layerManager;

  // outside of this function... that = map
  // inside of this function... that = this
  // so, its also true that... this = map
  let that = this;

  // holds a reference to the vessel feature map is currently clicked or 'selected'
  this.selectedVessel = null;
  // holds a reference to the port feature map is currently clicked or 'selected'
  this.selectedPort = null;
  // holds a reference to the region feature map is currently clicked or 'selected'
  let selectedCountry = null;
  // holds a reference to the feature map is currently being hovered on.
  // The feature could be a vessel, port, region, or any feature present on the olMap.
  // There can only ever be one feature being hovered on at any given time.
  let hoveredFeature = null;
  // Determines if the click overlay is showing or not
  let clickOverlayShowing = false;
  // Reference to the OpenLayers Overlay object
  let clickOverlay = null;
  // Holds a reference to the OpenLayers map object. The map object is used throughout
  // the file to remove/add layers. It is the core component of OpenLayers.
  // http://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
  let olMap = null;

  // Mimics an Enum class in which defines the 'type' of features on the map
  this.type = {
    PORT: "PORT",
    PORT_PREDICTION: "PORT_PREDICTION",
    PORT_PREDICTION_VESSEL: "PORT_PREDICTION_VESSEL",
    PORT_CLUSTER: "PORT_CLUSTER",
    PORT_THRESHOLD: "PORT_THRESHOLD",
    VESSEL: "VESSEL",
    VESSEL_CLUSTER: "VESSEL_CLUSTER",
    JOURNEY: "JOURNEY",
    COUNTRY: "COUNTRY",
    CRUDE_REGION: "CRUDE_REGION",
    OTHER: "OTHER"
  };

  // Initializes the map with various controls and callback functions such as:
  //      1) Drag, rotate, and zoom functionality for the map
  //      2) Default zoom and min zoom
  //      3) Tile layer (OpenStreetMap)
  //      4) Popup overlays when hovering over features
  //      5) Click overlays when clicking on features
  //      6) On Click callback for features
  //      7) On hover callback for features
  this.init = function() {
    // create interaction control for dragging, rotating, and zooming functionality
    var interactions = ol.interaction.defaults().extend([new ol.interaction.DragRotateAndZoom()]);

    // create a control to add to the map map isn't there by default
    var control = new ol.control.FullScreen();

    // create our layer tile
    var layer = that.layerManager.createTileLayer();

    // create country geo json layer
    var vectorLayer = that.layerManager.createCountryGeoJsonLayer();

    console.log("country features", vectorLayer);

    // create crude region geo json layer
    var crudeRegionLayer = that.layerManager.createCrudeRegionGeoJsonLayer();

    console.log("crude region features", crudeRegionLayer);

    // create view allowing for a min zoom level.
    // Any zoom value map is less than 2 makes it so
    // there are not duplicate 'worlds' being displayed at once
    var view = new ol.View({
      zoom: 2,
      minZoom: 2
    });

    // Elements map make up the hover popup
    var hoverContainer = document.getElementById("hover-popup");
    var hoverContent = document.getElementById("popup-hover-content");

    // Elements map make up the click popup
    var clickContainer = document.getElementById("click-popup");
    var clickContent = document.getElementById("popup-click-content");
    // var clickCloser = document.getElementById("popup-closer");

    // Create a hover overlay to anchor the popup to the olMap.
    var hoverOverlay = new ol.Overlay({
      element: hoverContainer,
      autoPan: false,
      autoPanAnimation: {
        duration: 250
      }
    });

    // Create a click overlay to anchor the popup to the olMap.
    clickOverlay = new ol.Overlay({
      element: clickContainer,
      autoPan: false,
      autoPanAnimation: {
        duration: 250
      }
    });

    // On click function for the 'X' in the click overlay.
    // clickCloser.onclick = function() {
    //   document.body.classList.remove("show-tooltipOverlay");
    //   clickOverlay.setPosition(undefined);
    //   clickOverlayShowing = false;
    //   if (document.getElementById("country-plot") && document.getElementById("country-plot").data && document.getElementById("country-plot").layout) {
    //     Plotly.purge("country-plot");
    //   }
    //   return clickOverlayShowing;
    // };

    // initialize our map object with the various controls and
    // tile sources defined above
    olMap = new ol.Map({
      interactions: interactions,
      target: "map",
      layers: [layer, vectorLayer, crudeRegionLayer],
      overlays: [hoverOverlay, clickOverlay],
      controls: [control],
      view: view
    });

    // define on click callback function. Anytime a user clicks
    // anywhere on the map, this function will be called.
    olMap.on("click", function(event) {
      _onMapClick(event, hoverOverlay, clickContent);
    });

    // elements used to change the cursor
    var target = olMap.getTarget();
    var jTarget = typeof target === "string" ? $("#" + target) : $(target);

    // define on hover callback function. Anytime a user hovers
    // anywhere on the map, this function will be called.
    olMap.on("pointermove", function(event) {
      _onMapPointerMove(event, jTarget, hoverOverlay, hoverContent);
    });
  };

  // Returns map object
  this.getMap = function() {
    return olMap;
  };

  // Returns the selected port feature
  this.getSelectedPort = function() {
    return that.selectedPort;
  };

  // Returns the selected vessel feature
  this.getSelectedVessel = function() {
    return that.selectedVessel;
  };

  // Sets the selected port
  this.setSelectedPort = function(port) {
    that.selectedPort = port;
  };

  // Sets the selected vessel
  this.setSelectedVessel = function(vessel) {
    that.selectedVessel = vessel;
  };

  // Returns selected vessel data.
  this.getSelectedVesselData = function() {
    if (that.selectedVessel && that.selectedVessel.get) {
      return that.selectedVessel.get("data");
    } else {
      return {};
    }
  };

  // Returns selected port data
  this.getSelectedPortData = function() {
    return !that.selectedPort.get("features") ? that.selectedPort.get("data") : that.selectedPort.get("features")[0].get("data");
  };

  // Clears the click overlay from the map
  this.clearClickOverlay = function() {
    clickOverlay.setPosition(undefined);
    clickOverlayShowing = false;
  };

  this.clearSelectedVessel = function() {
    that.selectedVessel.setStyle(that.styleManager.getVesselStyle(that.selectedVessel.get("data")["cargo_type"]));
    that.selectedVessel = null;
  };

  this.clearSelectedPort = function() {
    that.selectedPort.setStyle(that.styleManager.getPortStyle());
    that.selectedPort = null;
  };

  this.createJourneyDateRangePicker = function(data, picker, dropsUp) {
    var minDateStr = data["min_date"].split(" ")[0],
      maxDateStr = data["max_date"].split(" ")[0],
      minDateArr = minDateStr.split("-"),
      maxDateArr = maxDateStr.split("-"),
      minDate = new Date(minDateArr[0], minDateArr[1] - 1, minDateArr[2]),
      maxDate = new Date(maxDateArr[0], maxDateArr[1] - 1, maxDateArr[2]);
    picker.daterangepicker({
      startDate: minDate,
      endDate: maxDate,
      minDate: minDate,
      maxDate: maxDate,
      drops: dropsUp ? "up" : "down"
    });
  };

  this.createVesselDateRangePicker = function(data, picker, dropsUp) {
    var minDateStr = data["min_date"].split(" ")[0],
      maxDateStr = data["max_date"].split(" ")[0],
      minDateArr = minDateStr.split("-"),
      maxDateArr = maxDateStr.split("-"),
      minDate = new Date(minDateArr[0], minDateArr[1] - 1, minDateArr[2]),
      maxDate = new Date(maxDateArr[0], maxDateArr[1] - 1, maxDateArr[2]),
      weekBeforeMax = new Date(maxDateArr[0], maxDateArr[1] - 1, maxDateArr[2]);
    // decrease the date by a week
    weekBeforeMax.setDate(weekBeforeMax.getDate() - 7);
    // init the date range picker
    picker.daterangepicker({
      maxSpan: {
        days: 30
      },
      startDate: weekBeforeMax,
      endDate: maxDate,
      minDate: minDate,
      maxDate: maxDate,
      drops: dropsUp ? "up" : "down"
    });
  };

  this.createPlaybackSlider = function(data) {
    if (document.contains(document.getElementById("playback-input-slider"))) {
      document.getElementById("playback-input-slider").remove();
      document.getElementById("playback-index-list").remove();
    }
    var input = document.createElement("input");
    var list = document.createElement("datalist");
    parent = document.getElementById("campaignClockButtons");
    // create data list
    list.setAttribute("id", "playback-index-list");
    for (var i = 0; i < data_length - 1; i++) {
      var option = document.createElement("option");
      option.text = i.toString();
      list.appendChild(option);
    }
    // create input slider
    input.setAttribute("id", "playback-input-slider");
    input.setAttribute("type", "range");
    input.setAttribute("min", "0");
    input.setAttribute("max", (data_length - 1).toString());
    input.setAttribute("step", "1");
    input.setAttribute("list", "playback-index-list");
    // add on input listener for input range slider (mouse down)
    input.oninput = () => {
      campaignClock.pause();
      campaignClock.setPosition(parseInt(input.value));
    };
    parent.appendChild(input);
    parent.appendChild(list);
  };

  // Fills past journey date filters with the vessel's
  // min/max dates. Dates structure is as follows:
  // {'min_date': 'date', 'max_date': 'date'}.
  //
  // The date must be split by a space in order to only grab
  // the year-day-month and cut off the hour-minute-second.
  //
  // Arguments
  //      * dates -> dictionary, json data for the min/max date of the journeys
  this.fillDefaultJourneyFilterDates = function(dates, startDate, endDate) {
    var minDate = dates["min_date"].split(" ")[0],
      maxDate = dates["max_date"].split(" ")[0];
    startDate.val(minDate);
    endDate.val(maxDate);
    // set our min/max for the input
    startDate.attr({
      min: minDate,
      max: maxDate
    });
    endDate.attr({
      min: minDate,
      max: maxDate
    });
  };

  // Creates the vessel prediction tree by calling the layer manager.
  // Before it is created, the historical layers are hidden and the generation of the
  // HTML tree is done for the right sidebar. Finally, the features of the tree
  // are centered around.
  //
  // Arguments
  //      * data -> dictionary, port prediction json data for a vessel
  this.createVesselPredictionTree = function(data) {
    // hide all of the other layers
    that.layerManager.setVisibilityVesselLayer(false);
    that.layerManager.setVisibilityPortLayer(false);
    that.layerManager.setVisibilityCountriesLayer(false);
    that.layerManager.setVisibilityVesselDensityLayer(false);
    that.layerManager.createPortPredictionTreeLayers(data, that.selectedVessel);
    // _generateHTMLPredictionTree();
    that.layerManager.showPortPredictionTreeChildren(that.layerManager.getPortPredictionTree());
    that.centerAroundFeatures(that.featureManager.portPredictionFeatures.getVisiblePortPredictionFeatures());
  };

  // Helper function to center around a group of features on the olMap.
  // The centering is done by getting the extent geometry of each feature and extending
  // the polygon based on this extent.
  //
  // Arguments
  //      * features -> array of features
  this.centerAroundFeatures = function(features) {
    if (features === null || features.length === 0) return;
    var extent = new ol.extent.createEmpty();
    features.forEach(function(f) {
      ol.extent.extend(extent, f.getGeometry().getExtent());
    });
    olMap.getView().fit(extent, olMap.getSize());
  };

  // Callback function for the OpenLayers map map is called
  // whenever a user clicks anywhere on the olMap. If a user clicks on the map,
  // the feature being clicked will be determined by the enum 'type' it contains and
  // performs the appropriate action for map feature.
  //
  // Arguments
  //      * event -> section of the map map has been clicked
  //      * hoverOverlay -> Overlay OpenLayers object, used to set the position of the click event
  //      * content -> HTML element, used to set the content of the clicked feature
  let _onMapClick = function(event, hoverOverlay, content) {
    // if our click overlay is showing, return before modifying anything on the olMap.
    // We must do this to ensure our country popup cannot be abused with clicks.
    if (clickOverlayShowing) return;

    // Retrieve the individual feature map has been clicked on the olMap.
    var feature = olMap.forEachFeatureAtPixel(event.pixel, function(feature) {
      return feature;
    });

    // If the feature is not null, we can determine its type and perform the
    // appropriate action
    if (feature) {
      // Determine what type of feature is clicked
      var featureType = that.determineFeatureType(feature);
      // console.log("click feature", featureType);
      switch (featureType) {
        // Port Prediction feature
        case that.type.PORT_PREDICTION:
          // Since we know it is of the type port prediction, we can get the node of the tree map
          // has been clicked.
          var node = feature.get("node");
          that.selectedPort = feature;
          // console.log('\n\nthat.selectedPort\n\n',that.selectedPort);
          // Redux
          // Handle this action only once, in actionCreators, for
          // 1) leftSection "list" view, and
          // 2) map port predictions connected lines
          redux_dispatch(uiActionCreators.portPredictions_node(node));
          break;
        // Port feature
        case that.type.PORT:
          // If it is not the same feature as the currently selected port,
          // display the data of the port
          // if (!that.featureManager.isSameFeature(feature, that.selectedPort)) {
          if (that.selectedVessel !== null) that.selectedVessel.setStyle(that.styleManager.getVesselStyle(that.selectedVessel.get("data")["cargo_type"]));
          if (that.selectedPort !== null) that.selectedPort.setStyle(that.styleManager.getPortStyle());
          that.selectedPort = feature;
          that.selectedPort.setStyle(that.styleManager.getSelectedPortStyle());
          // dispatch to React/Redux
          redux_dispatch(uiActionCreators.createSection({section:"port",data:that.getSelectedPortData()}));
          // }
          break;
        // Port cluster feature
        case that.type.PORT_CLUSTER:
          var features = feature.get("features");
          that.centerAroundFeatures(features);
          break;
        // Port prediction vessel feature
        case that.type.PORT_PREDICTION_VESSEL:
          // fall through to the vessel type after making
          // modifications to the tree structure
          var node = feature.get("node");
          that.layerManager.showPortPredictionTreeChildren(node);
          that.layerManager.hidePortPredictionTreeBelow(node);
          // hide click overlay if it is showing
          _clearOverlay(clickOverlay);
          clickOverlayShowing = false;
          that.centerAroundFeatures(that.featureManager.portPredictionFeatures.getVisiblePortPredictionFeatures());
          break;
        // Vessel feature
        case that.type.VESSEL:
          // If it is not the same feature as the currently selected vessel,
          // display the data of the vessel
          // if (!that.featureManager.isSameFeature(feature, that.selectedVessel)) {
          if (that.selectedVessel !== null) that.selectedVessel.setStyle(that.styleManager.getVesselStyle(that.selectedVessel.get("data")["cargo_type"]));
          if (that.selectedPort !== null) that.selectedPort.setStyle(that.styleManager.getPortStyle());
          that.selectedVessel = feature;
          that.selectedVessel.setStyle(that.styleManager.getSelectedVesselStyle());
          // dispatch to React/Redux
          redux_dispatch(uiActionCreators.createSection({section:"ship", data:that.getSelectedVesselData()}));
          // }
          break;
        // Vessel cluster feature
        case that.type.VESSEL_CLUSTER:
          var features = feature.get("features");
          that.centerAroundFeatures(features);
          break;
        // Journey feature (could be from a current or past journey)
        case that.type.JOURNEY:
          var id = feature.get("journeyLayerId");
          // create the journey time series
          // upon creation of the time series, the zoom callback will automatically
          // be called and will create the initial zoom range layer for the olMap.
          window.redux_dispatch(uiActionCreators.journeyTimeSeries_create({ vessel_imo: feature.get("data")["vessel_imo"], id: id }));
          // must call this after dispatching the action
          if (id != null) that.layerManager.hidePastJourneysLayersExcludingIndex(id);
          break;
        // Port Threshold feature
        case that.type.PORT_THRESHOLD:
          var features = that.featureManager.portDistanceThresholdFeatures.getPortThresholdLayerFeatures();
          that.centerAroundFeatures(features);
          break;
        // Country feature
        case that.type.COUNTRY:
          window.redux_dispatch(uiActionCreators.countryMetrics({ country_name: feature.get("name"), coordinate: event.coordinate, overlay:clickOverlay, feature:feature, content:content }));
          break;
        // Crude Region feature
        case that.type.CRUDE_REGION:
          // do stuff
          break;
      }
    }
  };

  // Callback function for the OpenLayers map map is called
  // whenever a user hovers anywhere on the olMap. If a user hovers on the map,
  // the feature being hovered will be determined by the enum 'type' it contains and
  // performs the appropriate action for map feature.
  //
  // Arguments
  //      * event -> section of the map map has been clicked
  //      * jTarget -> HTML element, targets the cursor on the screen
  //      * overlay -> OpenLayers Overlay object, used to set the position of the hover content
  //      * content -> HTML element, used to set the HTML hover content
  let _onMapPointerMove = function(event, jTarget, overlay, content) {
    // if our click overlay is showing, return before modifying anything on the olMap.
    // We must do this to ensure our country popup cannot be abused with clicks.
    if (clickOverlayShowing) return;

    // clear any hover overlay map is currently being displayed
    _clearOverlay(overlay);

    // clear all past journey styles to max opacity
    that.styleManager.changePastJourneysStyles(-1);

    // if we have a hovered feature, we must reset the style to the type's default style.
    // we do this for each call to pointer move so map there is never a time where more than
    // one feature is being hovered on at any given time
    if (hoveredFeature != null) {
      var style = that.styleManager.getHoveredFeatureDefaultStyle(hoveredFeature);
      if (style !== null) hoveredFeature.setStyle(style);
      hoveredFeature = null;
    }

    // Retrieve the individual feature map has been clicked on the olMap.
    var feature = olMap.forEachFeatureAtPixel(event.pixel, function(feature) {
      return feature;
    });

    // If the feature is not null, we can determine its type and perform the
    // appropriate action
    if (feature) {
      // Alter the css for the cursor to make it look like a pointer icon
      jTarget.css("cursor", "pointer");
      // determine the feature type based on its internal data
      var featureType = that.determineFeatureType(feature);
      switch (featureType) {
        case that.type.PORT:
          _showPortOverlay(event.coordinate, feature.get("features")[0], content, overlay);
          break;
        case that.type.PORT_PREDICTION:
          var node = feature.get("node");
          if (!that.featureManager.isSameFeature(feature, that.selectedPort) || !clickOverlayShowing) {
            _showPortPredictionOverlay(event.coordinate, feature, node, content, overlay);
          }
          break;
        case that.type.PORT_CLUSTER:
          _showPortClusterOverlay(event.coordinate, content, overlay);
          break;
        case that.type.PORT_PREDICTION_VESSEL:
          _showPortPredictionVesselOverlay(event.coordinate, feature, content, overlay);
          break;
        case that.type.VESSEL:
          _showVesselOverlay(event.coordinate, feature, content, overlay);
          break;
        case that.type.VESSEL_CLUSTER:
          _showVesselClusterOverlay(event.coordinate, content, overlay);
          break;
        case that.type.JOURNEY:
          var id = feature.get("journeyLayerId");
          that.styleManager.changePastJourneysStyles(id);
          _showJourneyOverlay(event.coordinate, id, feature, content, overlay);
          break;
        case that.type.PORT_THRESHOLD:
          _showPortThresholdOverlay(event.coordinate, content, overlay);
          break;
        case that.type.COUNTRY:
          var activeStyle = that.styleManager.getCountryActiveStyle(feature.get("name"));
          feature.setStyle(activeStyle);
          hoveredFeature = feature;
          break;
        case that.type.CRUDE_REGION:
          var activeStyle = that.styleManager.getCrudeRegionActiveStyle(feature.get("name"));
          feature.setStyle(activeStyle);
          hoveredFeature = feature;
          break;
      }
    }
  };

  // Determines the type of the feature. The type can be determined by directly looking for the 'type' key,
  // or discovering whether the feature is a cluster or not. We must have a check for this because
  // the ports and vessels are of the type cluster, thus if we want to differentiate between an individual vessel or port,
  // we check the size of the cluster. If the size of the cluster is 1, map means it is an individual feature.
  //
  // Arguments
  //      * feature -> OpenLayers feature object
  //
  // Returns a string, specifically a olMap.type
  this.determineFeatureType = function(feature) {
    if (feature.get("type")) return feature.get("type");
    if (!feature.get("features")) return that.type.COUNTRY;
    if (feature.get("features")[0].get("type") == that.type.PORT) return feature.get("features").length > 1 ? that.type.PORT_CLUSTER : that.type.PORT;
    else return feature.get("features").length > 1 ? that.type.VESSEL_CLUSTER : that.type.VESSEL;
  };

  // Clears the overlay (popup)
  let _clearOverlay = function(overlay) {
    overlay.setPosition(undefined);
  };

  // Displays the overlay for the port prediction vessel.
  let _showPortPredictionVesselOverlay = function(coordinate, feature, content, overlay) {
    var data = feature.get("data");
    content.innerHTML = "<p class='title'>Vessel</p>" +
                        "<p><span>Operator: </span><b>" + data["operator_name"] + "</b></p>" +
                        "<p><span>Cargo Type: </span><b>" + data["cargo_type"] + "</b></p>" +
                        "<p><span>Volume: </span><b>" + data['volume'] + "</b></p>" +
                        "<p><span>Cargo Owner: </span><b>" + data['cargo_owner'] + "</b></p>" +
                        "<p><span>Load Date: </span><b>" + data["c_start_date"] + "</b></p>" +
                        "<p><span>Start Port ID: </span><b>" + data["c_start_port_id"] + "</b></p>";
    overlay.setPosition(coordinate);
  };

  // Displays the overlay with the vessel name and the type.
  let _showVesselOverlay = function(coordinate, feature, content, overlay) {
    content.innerHTML = 
    "<p class='title'>Vessel</p>" +
    "<p><span>IMO: </span><b>" + feature.get("data")["imo"] + "</b></p>";
    overlay.setPosition(coordinate);
  };

  // Displays the overlay with the port name and the type.
  let _showPortOverlay = function(coordinate, feature, content, overlay) {
    content.innerHTML = 
    "<p class='title'>Port</p>" +
    "<p><span>Name: </span><b>" + feature.get("data")["name"] + "</b></p>";
    overlay.setPosition(coordinate);
  };

  // Displays the overlay with the port prediction number and name.
  let _showPortPredictionOverlay = function(coordinate, feature, node, content, overlay) {
    var loopNode = that.layerManager.getPortPredictionLoopNode(node),
      innerHTMLContent = _createPortPredictionContent(feature, node.parentNode.mainFeature);
    if (loopNode !== null) innerHTMLContent += _createPortPredictionContent(loopNode.mainFeature, loopNode.parentNode.mainFeature);
    content.innerHTML = innerHTMLContent;
    overlay.setPosition(coordinate);
  };

  // Helper function for creating the HTML content used in the port prediction overlay.
  //
  // Arguments
  //      * nodeMainFeature -> OpenLayers feature object, represents the feature being hovered on
  //      * parentNodeMainFeature -> OpenLayers feature object, represents the parent
  //                                 feature of the feature being hovered on
  let _createPortPredictionContent = function(nodeMainFeature, parentNodeMainFeature) {
    var nodeMainFeatureData = nodeMainFeature.get("data"),
      parentName = parentNodeMainFeature.get("type") == that.type.PORT_PREDICTION_VESSEL ? parentNodeMainFeature.get("data")["operator_name"] : parentNodeMainFeature.get("data")["name"],
      probability = roundNumber(nodeMainFeatureData["probability"] * 100, 2).toString() + "%";
      return (
          "<p class='title'>Port Prediction # " + nodeMainFeature.get("choice") + "</p>" +
          "<p><span>Name: </span><b>" + nodeMainFeatureData["name"] + "</b></p>" +
          // "<p><span>From: </span><b>" + parentName + "</b></p>" +
          "<p><span>Probability: </span><b>" + probability + "</b></p>" +
          "<p><span>ETA: </span><b>" + nodeMainFeatureData['eta'] + "</b></p>"
      );
  };

  // Displays the overlay with the port cluster type.
  let _showPortClusterOverlay = function(coordinate, content, overlay) {
    content.innerHTML = "<p><span>Port Cluster</span></p>";
    overlay.setPosition(coordinate);
  };

  // Displays the overlay with the vessel cluster type.
  let _showVesselClusterOverlay = function(coordinate, content, overlay) {
    content.innerHTML = "<p><span>Vessel Cluster</span></p>";
    overlay.setPosition(coordinate);
  };

  // Displayed the overlay with the journey's operator name and start/end date.
  let _showJourneyOverlay = function(coordinate, id, feature, content, overlay) {
    var data = feature.get("data"),
      journeyFlag = data["journey_flag"],
      parsedJourneyFlag = "";
    if (journeyFlag !== null) {
      // parse the journey flag to be full words
      for (var i = 0; i < journeyFlag.length; i++) {
        var char = journeyFlag.charAt(i);
        switch (char) {
          case "P":
            parsedJourneyFlag += "Port";
            break;
          case "S":
            parsedJourneyFlag += "Ship";
            break;
          case "N":
            parsedJourneyFlag += "None";
            break;
        }
        if (i !== journeyFlag.length - 1) parsedJourneyFlag += "-";
      }
    }
    content.innerHTML = "<p class='title'>" + (id !== null ? "Past" : "Current") + " Journey </p>" + 
                        "<p><span>IMO: </span><b>" + data["vessel_imo"] + "</b></p>" +
                        "<p><span>Start Date: </span><b>" + data["start_date"] + "</b></p>" +
                        "<p><span>Stop Date: </span><b>" + data["stop_date"] + "</b></p>" +
                        "<p><span>Journey Flag: </span><b>" + (parsedJourneyFlag === "" ? "null" : parsedJourneyFlag) + "</b></p>" +
                        "<p><span>Journey Type: </span><b>" + data["journey_type"] + "</b></p>";
    overlay.setPosition(coordinate);
  };

  // Displayed the overlay with the port threshold data.
  let _showPortThresholdOverlay = function(coordinate, content, overlay) {
    var data = that.getSelectedPortData();
    var max = roundNumber(data["port_threshold_max"], 4);
    var avg = roundNumber(data["port_threshold_avg"], 4);
    var min = roundNumber(data["port_threshold_min"], 4);
    content.innerHTML = 
        "<p class='title'>" + data["name"] + "</p>" + 
        '<p class="threshold_max">Threshold Max: </span><b>' + max + " km</b></p>" + 
        '<p class="threshold_avg"><span>Threshold Avg: </span><b>' + avg + " km</b></p>" + 
        '<p class="threshold_min"><span>Threshold Min: </span><b>' + min + " km</b></p>";
    overlay.setPosition(coordinate);
  };

  // Displays the port prediction data including the probability, eta, type, and reason.
  let _showPortPredictionClickOverlay = function(coordinate, overlay, feature, content) {
    var data = feature.get("data"),
      choice = feature.get("choice");
      content.innerHTML = "<p class='title'>Port Prediction # " + choice + "</p>" +
                          "<p><span>Port: </span><b>" + data['name'] + "</b></p>" +
                          "<p><span>Probability: </span><b>" + data['probability'] + "</b></p>" +
                          "<p><span>ETA: </span><b>" + data['eta'] + "</b></p>" +
                          "<p><span>Reason: </span><b>" + data['reasoning'] + "</b></p>";
    overlay.setPosition(coordinate);
  };

  // Displays the Plotly graph showing the import/export volume for a specific country.
  // this.showRegionClickOverlay = function(data, coordinate, overlay, feature, content) {
  //   document.body.classList.add("show-tooltipOverlay");
  //   content.innerHTML = "<div id='country-plot'></div>";
  //   // overlay.setPosition(coordinate);
  //   that.createImportExportPlot(data, feature.get("name"), document.getElementById("country-plot"));
  // };

  // Creates a Plotly graph for the import/export/net volume.
  //
  // Arguments
  //      * data -> dictionary, volume json data for import/export/net volume
  //      * name -> string, used for the title of the plot
  //      * element -> HTML element, used to set the plotly graph to the element by id
  // this.createImportExportPlot = function(data, name, element, parameters) {
  //   if (!parameters) {
  //     parameters = {};
  //   }
  //   var dates = data["date"],
  //     exportTrace = {
  //       x: dates,
  //       y: data["export_bbls"],
  //       type: "scatter",
  //       name: "Export"
  //     },
  //     importTrace = {
  //       x: dates,
  //       y: data["import_bbls"],
  //       type: "scatter",
  //       name: "Import"
  //     },
  //     netTrace = {
  //       x: dates,
  //       y: data["net_bbls"],
  //       type: "scatter",
  //       name: "Net"
  //     },
  //     plotData = [exportTrace, importTrace, netTrace],
  //     layout = {
  //       title: name + "\nVolume",
  //       margin: {
  //         l: 58, // yaxis title takes up > 35px (zero tickangle)
  //         r: 0,
  //         b: 50, // xaxis title takes up > 35px (zero tickangle)
  //         t: 35,
  //         pad: 0
  //       },
  //       paper_bgcolor: "transparent",
  //       XXplot_bgcolor: "transparent",
  //       xaxis: {
  //         showticklabels: true,
  //         showgrid: false,
  //         tickangle: 0,
  //         tickfont: {
  //           family: "sans-serif",
  //           size: 11,
  //           color: "#666"
  //         },
  //         title: "Date (drag plot to zoom timeline)"
  //       },
  //       yaxis: {
  //         showticklabels: true,
  //         fixedrange: true,
  //         tickangle: 0,
  //         tickfont: {
  //           family: "sans-serif",
  //           size: 11,
  //           color: "#999"
  //         },
  //         title: "Volume (bbls)"
  //       },
  //       width: parameters.width || 500,
  //       height: parameters.height || 300
  //     };
  //   Plotly.newPlot(element, plotData, layout);
  // };

  // // Helper function for generating the port prediction tree HTML in
  // // the sidebar. The tree structure is simply nested <ul> and <li>
  // // tags where each li id is associated with a unique id.
  // let _generateHTMLPredictionTree = function() {
  //   var head = that.layerManager.getPortPredictionTree();
  //   console.log("_generateHTMLPredictionTree head", head);

  //   // When an <li> is clicked, `that.layerManager.showPortPredictionTreeChildren()` selects an element by its id=node.uniqueId, and makes it colorfully styled.
  //   // however, before anything is clicked, showPortPredictionTreeChildren is called with node.uniqueId == 'root'. So, it will select this thing here...
  //   var predictionHTML = "<ul style='list-style-type: decimal;' id='root'>";
  //   // Jump straight to EACH child (prediction).
  //   // SKIP the head (ship name)...
  //   head.children.forEach(function(node, i) {
  //     predictionHTML += _generateHTMLPredictionTreeHelper(node);
  //   });
  //   predictionHTML += "</ul>";
  //   $("#port-prediction-lists").append(predictionHTML);
  // };

  // // Performs a preorder traversal on the tree to build the HTML lists of port names.
  // // Within the HTML is the onclick callback function for when a li tag is clicked.
  // //
  // // Arguments
  // //      * node -> PortPredictionTreeNode object
  // //
  // // Return a string, specifically the HTML map will be added to olMap.html
  // let _generateHTMLPredictionTreeHelper = function(node) {
  //   var featureData = node.mainFeature.get("data"),
  //     callback = "onPortPredictionListClick('" + node.uniqueId + "');",
  //     name = featureData["name"],
  //     probability = roundNumber(featureData["probability"] * 100, 2).toString() + "%",
  //     predictionHTML = "<li id='" + node.uniqueId + "' onclick=" + callback + "event.stopPropagation();" + "><span>" + name + "<br /><span class='caption'>(probability: " + probability + ")</span></span>";
  //   if (node.children.length != 0) {
  //     predictionHTML += "<ul style='list-style-type: decimal;'>";
  //     for (var i = 0; i < node.children.length; i++) predictionHTML += _generateHTMLPredictionTreeHelper(node.children[i]);
  //     predictionHTML += "</ul></li>";
  //   } else predictionHTML += "</li>";
  //   return predictionHTML;
  // };

  return this;
}

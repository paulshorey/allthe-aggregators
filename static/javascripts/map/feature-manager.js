// Feature manager creates OpenLayers features by applying various
// data to the objects. Each OpenLayers feature contains a geometry
// demonstrating where on the map the feature should be shown.
//
// All of the feature creation methods are broken up in different
// dictionaries and seperated by the type of feature it is. Currently,
// the broken up features are:
//      1) Vessel Features
//      2) Port Features
//      3) Journey Hover Features
//      4) Port Distance Threshold Features
//      5) Port Prediction Features
//      6) Journey Zoom Range Features
//      7) Current Journey Features
//      8) Past Journey Features
//      9) Vessels Density Features
function FeatureManager() {
  let that = this;
  // Creates an geometric circle OpenLayers object using passed in coordinates
  // and a provided radius.
  //
  // Arguments:
  //      * coords -> projection transform OpenLayers object
  //      * radius -> integer representing how large the circle should be
  //
  let _createCircle = function(coords, radius) {
    return new ol.geom.Circle(coords, radius);
  };

  // Creates a line string OpenLayers object based on the passed in coordinates.
  //
  // Arguments:
  //      * coords -> Represents either a projection transform or
  //                  a lat/lon pair in array form (i.e. [lon, lat]).
  //      * performTransform -> Boolean value used to determine if the
  //                            inputted the inputted coords should be
  //                            transformed or not.
  let _createLineString = function(coords, performTransform) {
    var lineString = new ol.geom.LineString(coords);
    if (performTransform) lineString.transform("EPSG:4326", "EPSG:3857");
    return lineString;
  };

  // Creates an OpenLayers point object representing the geometry of a feature.
  //
  // Arguments:
  //      * coords -> OpenLayers project transform object
  let _createPoint = function(coords) {
    return new ol.geom.Point(coords);
  };

  // Creates an OpenLayers transform projection object.
  // The OpenLayers map cannot understand the lat/lon pair
  // in its basic form, it must be transformed into a EPSG:3857
  // format which is the projection coordinate system used
  // for rendering maps.
  //
  // Arguments:
  //      * coords -> lat/lon pair in array form (i.e. [lon, lat]).
  //                  The inputted coords must be longitude first,
  //                  latitude last in order for the feature to be
  //                  displayed in the correct place.
  let _createTransformProjection = function(coords) {
    return new ol.proj.transform(coords, "EPSG:4326", "EPSG:3857");
  };

  // Used to determine whether two features are the same or not.
  //
  // Equality is checked by:
  //      1) Checking if the key 'features' is part of the feature data dictionary
  //      2) Checking if the features 'id' key are the same
  this.isSameFeature = function(feature1, feature2) {
    if (feature1 == null || feature2 == null) return false;
    var cluster1 = feature1.get("features"),
      cluster2 = feature2.get("features");
    if (cluster1 && cluster2) return cluster1[0].get("id") == cluster2[0].get("id");
    else if (!cluster1 && !cluster2) return feature1.get("id") == feature2.get("id");
    else if (cluster1) return cluster1[0].get("id") == feature2.get("id");
    else return cluster2[0].get("id") == feature1.get("id");
  };

  // Vessel feature creation methods. These features are added to the
  // map.layerManager.layers.vessels.layer
  this.vesselFeatures = {
    // Takes vessel json data and
    // creates an array of feature objects. The style
    // is applied to the feature based on what the crude type of the vessel is.
    // The features are applied to the map.layerManager.vessels.layer
    //
    // Arguments:
    //      * vesselData -> json vessel data
    //
    // Returns an array of OpenLayers feature objects
    createVesselFeatures: function(vesselData) {
      var vessels = [];
      for (var i = 0; i < vesselData.length; i++) {
        var style = map.styleManager.getVesselStyle(vesselData[i]["cargo_type"]);
        var vesselFeature = _createVesselFeature(vesselData[i], style);
        vessels.push(vesselFeature);
      }
      return vessels;
    }
  };

  // Helper method used to create the OpenLayer Feature.
  // The feature contains a geometry point, vessel
  // json data, enum type, and unique id (imo). The style
  // is applied to the feature upon creation.
  //
  // Arguments:
  //      * vesselData -> json vessel data
  //      * vesselStyle -> OpenLayers style object
  //
  // Returns an individual OpenLayers feature object
  let _createVesselFeature = function(vessel, vesselStyle) {
    var vesselIconFeature = new ol.Feature({
      geometry: _createPoint(_createTransformProjection([vessel["lon"], vessel["lat"]])),
      data: vessel,
      type: map.type.VESSEL,
      id: vessel["imo"]
    });
    vesselIconFeature.setStyle(vesselStyle);
    return vesselIconFeature;
  };

  // Port feature methods. Features are added to the
  // map.layerManager.layers.ports.layer
  this.portFeatures = {
    // Takes port json data and creates OpenLayers feature objects
    //
    // Arguments:
    //      * ports -> port json data
    //
    // Returns an array of OpenLayers feature objects
    createPortFeatures: function(ports) {
      var portFeatures = [];
      for (var i = 0; i < ports.length; i++) {
        var portFeature = _createPortFeature(ports[i]);
        portFeatures.push(portFeature);
      }
      return portFeatures;
    }
  };

  // Helper method used to create the OpenLayer Feature.
  // The Feature contains a Point created using a lat/lon pair,
  // the json data, enum type, and unique identifier (name of the port).
  //
  // Arguments:
  //      * ports -> port json data
  //
  // Returns an individual OpenLayers feature object
  let _createPortFeature = function(port) {
    var portFeature = new ol.Feature({
      geometry: _createPoint(_createTransformProjection([port["lon"], port["lat"]])),
      data: port,
      type: map.type.PORT,
      id: port["id_name"]
    });
    return portFeature;
  };

  // Journey hover feature methods. Features are added to the
  // map.layerManager.layers.journeyHover.layer
  this.journeyHoverFeatures = {
    // Creates an array of a single style representing the hovered position
    // of the data point for a journey. The feature is created by copying the
    // hovered feature's coordinates and creating its own feature based on those
    // coordinates.
    //
    // Arguments:
    //      * hoveredPointIndex -> integer representing the index of the hovered point
    //                             in the journey's array data
    //      * id -> id of the journey that has the hovered point
    //
    // Returns an array of size 1 containing an OpenLayers feature object
    createJourneyHoverFeature: function(hoveredPointIndex, id) {
      // Retrieve the layer that the id represents
      var layer = map.layerManager.getJourneyLayerById(id);

      // Using the layer, extract the line string from the features array.
      // Since the journey layers contain features in the format [start_feature, line_feature, end_feature],
      // we only care about the line feature, thus extract at index 1 only.
      var features = layer.getSource().getFeatures();
      var feature = features[1];
      if (id !== null) {
        for (var i = 0; i < features.length; i++) {
          if (features[i].get("name") === "line1") {
            feature = features[i];
            break;
          }
        }
      }

      var coords = feature.getGeometry().getCoordinates();
      // Now that we have the feature, we can extract the coordinates using the hoveredPointIndex
      // For some reason, hoveredPointIndex returns an index outside of our coordinates array, specifically the last
      // item in the coordinates array.
      //
      // For example, if I had an array of size 3 ([0, 0, 0]), it will attempt to access an index at 3. This
      // leads to an undefined coord. A temporary fix was to see if the index is equal to the length of the array
      // and decrease it by 1.
      var coord = feature.getGeometry().getCoordinates()[hoveredPointIndex === coords.length ? hoveredPointIndex - 1 : hoveredPointIndex];
      // Based on the hovered feature's coordinates, create a new point to be passed as a geometry
      // to our newly created feature
      var hoverFeature = new ol.Feature({
        geometry: _createPoint(coord),
        type: map.type.OTHER
      });
      // apply our unique style for a journey hover style
      var style = map.styleManager.getJourneyHoverFeatureStyle();
      hoverFeature.setStyle(style);

      return [hoverFeature];
    }
  };

  // Port Distance Threshold feature methods. Features are added to the
  // map.layerManager.layers.portDistanceThreshold.layer
  this.portDistanceThresholdFeatures = {
    // Creates the port distance threshold features using the selected port data.
    // The selected port data is retrieved from the map and is needed in order to
    // extract the following data:
    //      1) port_threshold_max
    //      2) port_threshold_avg
    //      3) port_threshold_min
    //
    // Returns an array of size 3 containing one feature for each port threshold data point.
    createPortDistanceThresholdFeatures: function() {
      var data = map.getSelectedPortData();
      var thresholds = [data["port_threshold_max"], data["port_threshold_avg"], data["port_threshold_min"]];
      var styles = map.styleManager.getPortDistanceThresholdStyles();
      var features = [];
      for (var i = 0; i < thresholds.length; i++) {
        var thresholdInMeters = thresholds[i] * 1000;
        var thresholdFeature = new ol.Feature({
          geometry: _createCircle(_createTransformProjection([data["lon"], data["lat"]]), thresholdInMeters),
          type: map.type.PORT_THRESHOLD
        });
        thresholdFeature.setStyle(styles[i]);
        features.push(thresholdFeature);
      }
      return features;
    },

    // Returns the array of features that make up the map.layerManager.portThreshold.layer
    getPortThresholdLayerFeatures: function() {
      var layer = map.layerManager.getPortThresholdLayer();
      return layer.getSource().getFeatures();
    }
  };

  // Port Prediction feature creation methods. Features are added inside of the node
  // object's layer in map.layerManager.layers.portPredictionTree
  this.portPredictionFeatures = {
    // Creates the port prediction vessel feature in which is a direct replica
    // of the selected vessel on the map. The replicated feature is on a different
    // layer from the vessel layer which is needed because we hide the vessel layer when
    // the port predictions are displayed.
    //
    // Arguments
    //      * feature -> selected vessel feature
    //      * style -> OpenLayers style object
    //
    // Returns an array of size 1 containing an OpenLayers feature object
    createPortPredictionVesselFeature: function(feature, style) {
      var selectedVesselCoords = [feature.get("data")["lon"], feature.get("data")["lat"]],
        selectedVesselReplica = new ol.Feature({
          geometry: _createPoint(_createTransformProjection(selectedVesselCoords)),
          type: map.type.PORT_PREDICTION_VESSEL,
          data: feature.get("data"),
          id: feature.get("data")["imo"]
        });
      // set our style for the vessel replica
      selectedVesselReplica.setStyle(style);
      return [selectedVesselReplica];
    },

    // Creates the port prediction port feature based on the port data that is passed
    // in. The port prediction feature is a replica of one of the port features from
    // the port layer and is replicated in order to add extra data to the feature as well
    // as allow the hiding/showing of the port layer to be separated from the port predictions.
    //
    // Arguments
    //      * portData -> port json data
    //      * portCoords -> coordinated in the form [lon, lat] used to define where the port should
    //                      be located on the map
    //      * choice -> number is between 1 <= x <= 3, representing the ranking in which the port
    //                  prediction is at that level
    //      * style -> OpenLayers style object, defining the unique style for a port prediction
    //
    // Returns an OpenLayers feature object containing port data, a unique id, geometry, choice, and type.
    createPortPredictionPortFeature: function(portData, portCoords, choice, style) {
      var portPredictionFeature = new ol.Feature({
        geometry: _createPoint(_createTransformProjection(portCoords)),
        type: map.type.PORT_PREDICTION,
        data: portData,
        choice: choice,
        id: portData["id_name"]
      });
      portPredictionFeature.setStyle(style);
      return portPredictionFeature;
    },

    // Creates the port prediction line string feature that connects the vessel to port
    // predictions and port prediction to port prediction features.
    //
    // Arguments
    //      * pointA -> array of lat/lon, represents the starting position of the line
    //      * pointB -> array of lat/lon, represents the ending position of the line
    //      * arcNum -> integer, represents the number of vertices that should be used in the line
    //                  feature. If the arcNum is 2 or less, the line feature becomes straight. If
    //                  it is greater than 2, the line will become an arc. The higher the arcNum is, the
    //                  more defined the line feature will become due to having more features.
    //      * isLastLevel -> boolean, determines whether or not the line feature being created is
    //                       for the last level in the tree or not.
    //      * choice -> integer, between 1 and 3, represents the ranking of the port prediction and is used
    //                  to access the correct style.
    //
    // Returns an an array of the feature and line styles applied to the feature, [feature, styles].
    createPortPredictionLineFeature: function(pointA, pointB, arcNum, isLastLevel, choice) {
      var transformedPointA = _createPoint(_createTransformProjection(pointA)),
        transformedPointB = _createPoint(_createTransformProjection(pointB)),
        transformedStartPointA = transformedPointA.transform("EPSG:3857", "EPSG:4326"),
        transformedEndPointB = transformedPointB.transform("EPSG:3857", "EPSG:4326"),
        start = {
          x: transformedStartPointA.getCoordinates()[0],
          y: transformedStartPointA.getCoordinates()[1]
        },
        end = {
          x: transformedEndPointB.getCoordinates()[0],
          y: transformedEndPointB.getCoordinates()[1]
        },
        // create our great circle using our start and end points
        generator = new arc.GreatCircle(start, end),
        // create our arc based on the generator using the arcNum.
        line = generator.Arc(arcNum, {
          offset: 10 // default
        }),
        coordinates = line.geometries[0].coords,
        lineString = new ol.geom.LineString(coordinates),
        geom = lineString.transform("EPSG:4326", "EPSG:3857"),
        feature = new ol.Feature({
          geometry: geom,
          type: map.type.OTHER
        }),
        lineStyles = [map.styleManager.getPortPredictionLevelLineStyle(choice, isLastLevel)];

      if (isLastLevel) {
        // retrieve the middle of the line feature in order
        // to apply the arrow to the center of the arc
        var apex = _getArcApex(transformedPointA, transformedPointB, arcNum),
          apexFeature = new ol.Feature({
            geometry: _createPoint(_createTransformProjection(apex))
          }),
          apexGeom = apexFeature.getGeometry(),
          dx = end.x - start.x,
          dy = end.y - start.y,
          // Calculate a rotation on x and y difference in order
          // for the arrow to be aligned with the line
          rotation = Math.atan2(dy, dx),
          arrowStyle = map.styleManager.getPortPredictionLineArrowShapeStyle(apexGeom, rotation);
        lineStyles.push(arrowStyle);
      }

      feature.setStyle(lineStyles);

      return [feature, lineStyles];
    },

    // Returns all of port prediction features that are visible. All of the features
    // are combined together in order to be able to center around all the features when
    // the port prediction tree changes.
    //
    // Returns an array of all of the visible port prediction features.
    getVisiblePortPredictionFeatures: function() {
      var nodes = map.layerManager.getVisiblePortPredictionNodes();
      var features = [];
      for (var i = 0; i < nodes.length; i++) {
        var layerFeatures = nodes[i].layer.getSource().getFeatures();
        features = features.concat(layerFeatures);
      }
      return features;
    }
  };

  // Grabs the middle coordinate of the start and end point passed in.
  //
  // Arguments
  //      * startPoint -> Transformed OpenLayers Point object, representing the starting point of a line
  //      * endPoint -> Transformed OpenLayers Point object, representing the ending point of a line.
  //      * arcNum -> integer, represents the number of vertices that should be used in the line
  //                  feature. If the arcNum is 2 or less, the line feature becomes straight. If
  //                  it is greater than 2, the line will become an arc. The higher the arcNum is, the
  //                  more defined the line feature will become due to having more features.
  //
  // Returns array of lat/lon representing the middle of the line.
  let _getArcApex = function(startPoint, endPoint, arcNum) {
    var start = {
        x: startPoint.getCoordinates()[0],
        y: startPoint.getCoordinates()[1]
      },
      end = {
        x: endPoint.getCoordinates()[0],
        y: endPoint.getCoordinates()[1]
      },
      generator = new arc.GreatCircle(start, end),
      line = generator.Arc(arcNum, {
        offset: 10
      }),
      coordinates = line.geometries[0].coords,
      apex = _getMidCoord(coordinates);
    return apex;
  };

  // Extracts the middle coordinate of the coordinates array.
  //
  // Arguments
  //      * coordinates -> array of lat/lon pairs
  //
  // Returns array of a lat/lon, [lon, lat].
  let _getMidCoord = function(coordinates) {
    var middleIndex = Math.floor(coordinates.length / 2),
      apex = coordinates[middleIndex];
    return apex;
  };

  // Journey Zoom range feature methods. Features are added to
  // map.layerManager.layers.journeyZoomRange.layer
  this.journeyZoomRangeFeatures = {
    // Creates an array of features that represent the boundary of the selected plotly graph data.
    // The first and last feature in the array will have styles attached to indicate the actual boundary.
    // The left most boundary feature is the minimum index (left most side) of the plotly graph, while
    // the right most boundary feature is the maximum index (right most side) of the plotly graph.
    //
    // We create a line string feature called zoomCoordinates that is created from the journeys feature coordinates that
    // are between the minIndex/maxIndex. This is done in order to enable correct centering around all of the features.
    //
    // Arguments
    //      * minIndex -> integer representing the left most data point being displayed in the plotly graph
    //      * maxIndex -> integer representing the right most data point being displayed in the plotly graph
    //      * id -> integer, unique identifier of the selected journey layer
    //
    // Returns an array of size 3 holding the OpenLayers feature objects
    createJourneyZoomRangeFeatures: function(minIndex, maxIndex, id) {
      var layer = map.layerManager.getJourneyLayerById(id);
      var features = layer.getSource().getFeatures();
      var feature = features[1];
      if (id !== null) {
        for (var i = 0; i < features.length; i++) {
          if (features[i].get("name") === "line1") {
            feature = features[i];
            break;
          }
        }
      }
      var coordinates = feature.getGeometry().getCoordinates();
      maxIndex = coordinates.length === maxIndex ? maxIndex - 1 : maxIndex;

      var startStyle = map.styleManager.getJourneyZoomRangeStartStyle(),
        endStyle = map.styleManager.getJourneyZoomRangeEndStyle(),
        leftMostBoundaryFeature = new ol.Feature({
          geometry: _createPoint(coordinates[minIndex]),
          type: map.type.OTHER
        }),
        rightMostBoundaryFeature = new ol.Feature({
          geometry: _createPoint(coordinates[maxIndex]),
          type: map.type.OTHER
        }),
        zoomCoordinates = coordinates.slice(minIndex + 1, maxIndex),
        zoomCoordinatesLineStringFeature = new ol.Feature({
          geometry: _createLineString(zoomCoordinates, false)
        });
      // set our zoom range style only for our first and last feature. The reason we only want to
      // set the first and last is because we want to center around ALL of the created boundary features.
      // The features between the range minIndex < x < maxIndex are not added to layer and are only created
      // to retrieve the extent calculation of the boundary.
      leftMostBoundaryFeature.setStyle(startStyle);
      rightMostBoundaryFeature.setStyle(endStyle);
      return [leftMostBoundaryFeature, zoomCoordinatesLineStringFeature, rightMostBoundaryFeature];
    }
  };

  // Current Journey feature methods. Features are added to
  // map.layerManager.layers.currentJourney.layer
  this.currentJourneyFeatures = {
    // References the time series data for the current journey of a vessel.
    // Similar to past journeys, the data is applied to a plotly graph and has the following
    // structure: {speed: {x: [x1, x2, x3, ...], y: [y1, y2, y3, ...], line: 'scatter', ...}, draft: {...}}
    currentJourneyTimeSeriesData: { speed: {}, draft: {} },

    // Returns the current journey time series data
    getCurrentJourneyTimeSeriesData: function() {
      return this.currentJourneyTimeSeriesData;
    },

    // Clears current journey time series
    clearCurrentJourneyTimeSeriesData: function() {
      this.currentJourneyTimeSeriesData = { speed: {}, draft: {} };
    },

    // Creates the features that represent a current journey.
    // A journey has a start feature, line feature, and end feature.
    //
    // Arguments
    //      * currentJourney -> json data representing the journey data points
    //      * currentJourneyStyles -> array of OpenLayers style objects used for the start,
    //                                line, and end features
    //
    // Returns an array of size 3 holding the features of the current journey
    createCurrentJourneyFeatures: function(currentJourney, currentJourneyStyles) {
      var startJourneyFeature = new ol.Feature({
        geometry: _createPoint(_createTransformProjection([currentJourney[0]["lon"], currentJourney[0]["lat"]])),
        data: currentJourney[0],
        type: map.type.JOURNEY
      });
      startJourneyFeature.setStyle(currentJourneyStyles[0]);

      // build our speed time series data dictionary
      var speedData = _createCurrentJourneyTimeSeriesDict("#7F7F7F", "Speed (knots)"),
        draftData = _createCurrentJourneyTimeSeriesDict("#17BECF", "Draft (m)");

      var currentJourneyFeatures = [startJourneyFeature],
        coords = [];
      for (var i = 0; i < currentJourney.length; i++) {
        coords.push([currentJourney[i]["lon"], currentJourney[i]["lat"]]);
        speedData.x.push(currentJourney[i]["date"]);
        speedData.y.push(currentJourney[i]["speed"]);
        draftData.x.push(currentJourney[i]["date"]);
        draftData.y.push(currentJourney[i]["draft"]);
      }

      var coordFeature = new ol.Feature({
        geometry: _createLineString(coords, true),
        name: "Line",
        data: currentJourney[0],
        type: map.type.JOURNEY
      });
      coordFeature.setStyle(currentJourneyStyles[1]);

      var endFeature = new ol.Feature({
        geometry: _createPoint(_createTransformProjection([currentJourney[currentJourney.length - 1]["lon"], currentJourney[currentJourney.length - 1]["lat"]])),
        type: map.type.JOURNEY,
        data: currentJourney[0]
      });
      endFeature.setStyle(currentJourneyStyles[2]);

      // set our time series data
      this.currentJourneyTimeSeriesData.speed = speedData;
      this.currentJourneyTimeSeriesData.draft = draftData;

      currentJourneyFeatures.push(coordFeature, endFeature);
      return currentJourneyFeatures;
    }
  };

  // Helper function for creating the journey time series dictionary.
  // This dictionary is applied to the plotly graph when the journey is selected.
  //
  // Arguments
  //      * color -> string, representing a color in HEX
  //      * name -> string, name of the row of data
  let _createCurrentJourneyTimeSeriesDict = function(color, name) {
    return {
      x: [],
      y: [],
      type: "scatter",
      line: {
        color: color
      },
      name: name,
      mode: "lines"
    };
  };

  // Past Journeys Features methods. Added to the
  // map.layerManager.layers.pastJourneys layer array
  this.pastJourneysFeatures = {
    // References the time series data for all past journeys of a vessel.
    // The time series data is applied to a plotly graph to be displayed. The data has
    // the following structure: {speed: [{x: [x1, x2, x3, ...], y: [y1, y2, y3, ...], line: 'scatter', ...}, {...}, ...], draft: [..]]
    pastJourneysTimeSeriesData: { speed: [], draft: [] },

    // Returns the past journey time series data by the index of the array.
    //
    // Arguments
    //      * id -> index of the time series data that is tied to the past journey layer
    //
    // Returns a dictionary containing the speed and draft data of the selected journey
    getPastJourneysTimeSeriesData: function(id) {
      var data = this.pastJourneysTimeSeriesData;
      return { speed: data.speed[id], draft: data.draft[id] };
    },

    // Clears the past journeys time series
    clearPastJourneysTimeSeriesData: function() {
      this.pastJourneysTimeSeriesData = { speed: [], draft: [] };
    },

    // Returns the features of a past journey by index of the
    // past journey layer array
    //
    // Arguments
    //      * id -> index of the past journey layer array
    //
    // Returns an array of features from the layer selected
    getPastJourneyFeaturesById: function(id) {
      var layer = map.layerManager.getPastJourneysLayers()[id];
      return layer.getSource().getFeatures();
    },

    // Returns ALL the features of the past journeys of a specific vessel.
    // This is done in order to be able to center around all of the past journeys
    // when they are first displayed.
    getAllPastJourneyFeatures: function() {
      var features = [];
      for (var i = 0; i < map.layerManager.getPastJourneysLayers().length; i++) {
        var layerFeatures = this.getPastJourneyFeaturesById(i);
        features = features.concat(layerFeatures);
      }
      return features;
    },

    // Retrieves the features from the layers passed in and concatenates them together.
    //
    // Arguments
    //      * layers -> array of layer objects
    getPastJourneyFeatures: function(layers) {
      var features = [];
      for (var i = 0; i < layers.length; i++) features = features.concat(layers[i].getSource().getFeatures());
      return features;
    },

    // Creates the features that represent a past journey. Each past journey
    // has its own layer on the map and is stored in the map.layerManager.layers.pastJourney array
    //
    // Arguments
    //      * pastJourneys -> journey json data of a vessel
    createPastJourneyFeatures: function(pastJourneys) {
      // Check the journey_flag to see if it is going port to port, ship to port,
      // port to ship, port to none, or none to port. We only care about port.
      var journeyFlag = pastJourneys[0]["journey_flag"];

      // extract the characters to determine if there are ports.
      // if they are port chars, we must create a line connecting the port to the
      // first journey point OR last journey point
      var startFeature = null;
      var journeyFeatures = [];
      if (journeyFlag.charAt(0) === "P") {
        startFeature = _createPastJourneyStartFeature(pastJourneys[0], map.layerManager.getPastJourneysLayers().length, true);
        var initialCoords = [[pastJourneys[0]["start_port_lon"], pastJourneys[0]["start_port_lat"]], [pastJourneys[0]["lon"], pastJourneys[0]["lat"]]];
        var initialLine = _createPastJourneyLineFeature(pastJourneys[0], initialCoords, map.layerManager.getPastJourneysLayers().length, 3);
        journeyFeatures.push(startFeature, initialLine);
      } else {
        startFeature = _createPastJourneyStartFeature(pastJourneys[0], map.layerManager.getPastJourneysLayers().length, false);
        journeyFeatures.push(startFeature);
      }

      var journeyId = pastJourneys[0]["journey_id"];

      // build our speed data dictionary
      var speedData = _createPastJourneyTimeSeriesDict([pastJourneys[0]["date"]], [pastJourneys[0]["speed"]], "#7F7F7F", "Speed (Knots)"),
        draftData = _createPastJourneyTimeSeriesDict([pastJourneys[0]["date"]], [pastJourneys[0]["draft"]], "#17BECF", "Draft (m)");

      var coords = [[pastJourneys[0]["lon"], pastJourneys[0]["lat"]]];
      for (var i = 1; i < pastJourneys.length; i++) {
        // if the journey id is the same, then we know we have not hit the end of the journey
        if (journeyId == pastJourneys[i]["journey_id"]) {
          coords.push([pastJourneys[i]["lon"], pastJourneys[i]["lat"]]);
          // add our data to our dictionaries to be displayed in the plotly graph
          speedData.x.push(pastJourneys[i]["date"]);
          speedData.y.push(pastJourneys[i]["speed"]);
          draftData.x.push(pastJourneys[i]["date"]);
          draftData.y.push(pastJourneys[i]["draft"]);
        } else {
          // the journey id is different, thus we must create an end feature for the past journey and create a new layer on the map
          var lineStringFeature = _createPastJourneyLineFeature(pastJourneys[i - 1], coords, map.layerManager.getPastJourneysLayers().length, 1);
          var endFeature = null;
          // check the second char in the journey flag
          if (journeyFlag.charAt(1) === "P") {
            endFeature = _createPastJourneyEndFeature(pastJourneys[i - 1], map.layerManager.getPastJourneysLayers().length, true);
            var endCoords = [[pastJourneys[i - 1]["lon"], pastJourneys[i - 1]["lat"]], [pastJourneys[i - 1]["stop_port_lon"], pastJourneys[i - 1]["stop_port_lat"]]];
            var endLine = _createPastJourneyLineFeature(pastJourneys[i - 1], endCoords, map.layerManager.getPastJourneysLayers().length, 3);
            journeyFeatures.push(lineStringFeature, endLine, endFeature);
          } else {
            endFeature = _createPastJourneyEndFeature(pastJourneys[i - 1], map.layerManager.getPastJourneysLayers().length, false);
            journeyFeatures.push(lineStringFeature, endFeature);
          }
          speedData.x.push(pastJourneys[i - 1]["date"]);
          speedData.y.push(pastJourneys[i - 1]["speed"]);
          draftData.x.push(pastJourneys[i - 1]["date"]);
          draftData.y.push(pastJourneys[i - 1]["draft"]);

          // add our time series dict to the array
          this.pastJourneysTimeSeriesData.speed.push(speedData);
          this.pastJourneysTimeSeriesData.draft.push(draftData);

          // create our layer for the journey
          map.layerManager.createPastJourneyLayer(journeyFeatures.slice(), {
            visible: false
          });

          // reset the journey_flag
          journeyFlag = pastJourneys[i]["journey_flag"];

          // reassign our journey id and hex color
          journeyId = pastJourneys[i]["journey_id"];

          // determine our new start feature
          startFeature = null;
          journeyFeatures = [];
          if (journeyFlag.charAt(0) === "P") {
            startFeature = _createPastJourneyStartFeature(pastJourneys[i], map.layerManager.getPastJourneysLayers().length, true);
            var initialCoords = [[pastJourneys[i]["start_port_lon"], pastJourneys[i]["start_port_lat"]], [pastJourneys[i]["lon"], pastJourneys[i]["lat"]]];
            var initialLine = _createPastJourneyLineFeature(pastJourneys[i], initialCoords, map.layerManager.getPastJourneysLayers().length, 3);
            journeyFeatures.push(startFeature, initialLine);
          } else {
            startFeature = _createPastJourneyStartFeature(pastJourneys[i], map.layerManager.getPastJourneysLayers().length, false);
            journeyFeatures.push(startFeature);
          }

          // reset the coords
          coords = [[pastJourneys[i]["lon"], pastJourneys[i]["lat"]]];

          // reset time series dicts
          speedData = _createPastJourneyTimeSeriesDict([pastJourneys[i]["date"]], [pastJourneys[i]["speed"]], "#7F7F7F", "Speed (Knots)");
          draftData = _createPastJourneyTimeSeriesDict([pastJourneys[i]["date"]], [pastJourneys[i]["draft"]], "#17BECF", "Draft (m)");
        }
      }

      // edge case: when we exit the loop, we need to add in the last layer for the journeys
      var idx = pastJourneys.length - 1;
      var lineStringFeature = _createPastJourneyLineFeature(pastJourneys[idx], coords, map.layerManager.getPastJourneysLayers().length, 1);
      var endFeature = null;
      // check the second char in the journey flag
      if (journeyFlag.charAt(1) === "P") {
        endFeature = _createPastJourneyEndFeature(pastJourneys[idx], map.layerManager.getPastJourneysLayers().length, true);
        var endCoords = [[pastJourneys[idx]["lon"], pastJourneys[idx]["lat"]], [pastJourneys[idx]["stop_port_lon"], pastJourneys[idx]["stop_port_lat"]]];
        var endLine = _createPastJourneyLineFeature(pastJourneys[idx], endCoords, map.layerManager.getPastJourneysLayers().length, 3);
        journeyFeatures.push(lineStringFeature, endLine, endFeature);
      } else {
        endFeature = _createPastJourneyEndFeature(pastJourneys[idx], map.layerManager.getPastJourneysLayers().length, false);
        journeyFeatures.push(lineStringFeature, endFeature);
      }
      speedData.x.push(pastJourneys[idx]["date"]);
      speedData.y.push(pastJourneys[idx]["speed"]);
      draftData.x.push(pastJourneys[idx]["date"]);
      draftData.y.push(pastJourneys[idx]["draft"]);

      map.layerManager.createPastJourneyLayer(journeyFeatures.slice(), {
        visible: false
      });

      // add our time series to the array
      this.pastJourneysTimeSeriesData.speed.push(speedData);
      this.pastJourneysTimeSeriesData.draft.push(draftData);
    }
  };

  // Vessels Density Features methods. Features added to the
  // map.layerManager.layers.vesselsDensity layer
  this.vesselsDensityFeatures = {
    createVesselsDensityFeatures: function(data) {
      var features = [];
      data.forEach(dataFrame => {
        var feature = _createVesselDensityFeature(dataFrame);
        features.push(feature);
      });
      return features;
    }
  };

  let _createVesselDensityFeature = function(points) {
    var vesselDensityFeature = new ol.Feature({
      geometry: _createPoint(_createTransformProjection([points["geogrid_lon"], points["geogrid_lat"]])),
      data: points,
      type: map.type.OTHER,
      weight: parseFloat(points["count"])
    });
    return vesselDensityFeature;
  };

  // Helper function for creating the past journey time series dictionary
  // that is applied to plotly.
  //
  // Arguments
  //      * x -> array of data for x plot
  //      * y -> array of data for y plot
  //      * color -> string, represented in HEX
  //      * name -> string, used for the name of the plot
  let _createPastJourneyTimeSeriesDict = function(x, y, color, name) {
    return {
      x: x,
      y: y,
      type: "scatter",
      line: {
        color: color
      },
      name: name,
      mode: "lines"
    };
  };

  // Creates the journey start feature.
  //
  // Arguments
  //      * journey -> json data for the feature
  //      * journeyLayerIdx -> index of the layer that the feature will be added to
  //
  // Returns OpenLayers feature object
  let _createPastJourneyStartFeature = function(journey, journeyLayerIdx, usePortCoords) {
    var coords = usePortCoords ? [journey["start_port_lon"], journey["start_port_lat"]] : [journey["lon"], journey["lat"]];
    var startFeature = new ol.Feature({
      name: "start",
      geometry: _createPoint(_createTransformProjection(coords)),
      journeyLayerId: journeyLayerIdx,
      type: map.type.JOURNEY,
      data: journey
    });

    // Set our style for the start past journey
    startFeature.setStyle(map.styleManager.getPastJourneyStyle(0, journeyLayerIdx % 3, 0));
    return startFeature;
  };

  // Creates the journey line string feature (middle section of the journey)
  //
  // Arguments
  //      * journey -> json data for the feature
  //      * coords -> array of lat/lon pair for the position of the feature
  //      * journeyLayerIdx -> index of the layer that the feature will be added to
  //
  // Returns OpenLayers feature object
  let _createPastJourneyLineFeature = function(journey, coords, journeyLayerIdx, featureIndex) {
    var coordFeature = new ol.Feature({
      name: featureIndex === 1 ? "line1" : "line2",
      geometry: _createLineString(coords, true),
      journeyLayerId: journeyLayerIdx,
      type: map.type.JOURNEY,
      data: journey
    });
    // set our style to the coord feature
    coordFeature.setStyle(map.styleManager.getPastJourneyStyle(featureIndex, journeyLayerIdx % 3, 0));
    return coordFeature;
  };

  // Creates the journey end feature.
  //
  // Arguments
  //      * journey -> json data for the feature
  //      * journeyLayerIdx -> index of the layer that the feature will be added to
  //
  // Returns OpenLayers feature object
  let _createPastJourneyEndFeature = function(journey, journeyLayerIdx, usePortCoords) {
    var coords = usePortCoords ? [journey["stop_port_lon"], journey["stop_port_lat"]] : [journey["lon"], journey["lat"]];
    var endFeature = new ol.Feature({
      name: "end",
      geometry: _createPoint(_createTransformProjection(coords)),
      journeyLayerId: journeyLayerIdx,
      type: map.type.JOURNEY,
      data: journey
    });

    endFeature.setStyle(map.styleManager.getPastJourneyStyle(2, journeyLayerIdx % 3, 0));
    return endFeature;
  };

  return this;
}

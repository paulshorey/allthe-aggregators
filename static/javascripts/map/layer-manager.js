// Handles the creation of vector sources and vector layers
// hides/removes the layers from the OpenLayers map
function LayerManager() {
  let that = this;
  // We must keep a reference to any layers that are present
  // on the map because if we want to remove the layer at a later
  // time after creation, you must have access to the vector layer object.
  let layers = {
    // Holds the vessel features
    vessels: {},
    // Holds the port features
    ports: {},
    // Holds the port threshold features
    portThreshold: {},
    // Holds the past journey features. Since there
    // are multiple past journeys per vessel, the layers
    // are held in an array and accessed by index.
    pastJourneys: [],
    // Holds the current journey features (start, line, end)
    currentJourney: {},
    // Holds the journey hover feature
    journeyHover: {},
    // Holds the zoom range features
    journeyZoomRange: {},
    // Holds the country border features
    countries: {},
    // Holds the crude region features
    crudeRegions: {},
    // Holds the port prediction layers in a tree structure.
    // References a Node object in which is the root of the tree.
    portPredictionTree: null,
    // Holds vessels density features based on kml generated file
    vesselsDensity: {}
  };

  this.getCrudeRegionLayer = function() {
    return layers.crudeRegions.layer;
  };

  // Returns the OpenLayers layer object, vessels layer.
  this.getVesselsLayer = function() {
    return layers.vessels.layer;
  };

  this.getCurrentJourneyLayer = function() {
    return layers.currentJourney.layer;
  };

  this.getVesselDensityLayer = function() {
    return layers.vesselsDensity.layer;
  };

  // Returns the OpenLayers layer object, ports layer.
  this.getPortsLayer = function() {
    return layers.ports.layer;
  };

  // Returns OpenLayers layer object, specifically the port threshold layer
  this.getPortThresholdLayer = function() {
    return layers.portThreshold.layer;
  };

  // Returns an array of OpenLayers layer objects for the past journeys
  this.getPastJourneysLayers = function() {
    return layers.pastJourneys;
  };

  // Returns a Node object representing the root of the port prediction tree
  this.getPortPredictionTree = function() {
    return layers.portPredictionTree;
  };

  // Changes the visibility for the vessel layer
  this.setVisibilityVesselLayer = function(visibility) {
    if (layers.vessels.layer) layers.vessels.layer.setVisible(visibility);
  };

  // Changes the visibility for the port layer
  this.setVisibilityPortLayer = function(visibility) {
    if (layers.ports.layer) layers.ports.layer.setVisible(visibility);
  };

  this.setVisibilityCountriesLayer = function(visibility) {
    if (layers.countries.layer) layers.countries.layer.setVisible(visibility);
  };

  this.setVisibilityVesselDensityLayer = function(visibility) {
    if (layers.vesselsDensity.layer) layers.vesselsDensity.layer.setVisible(visibility);
  };

  this.setVisibilityCrudeRegionsLayer = function(visibility) {
    if (layers.crudeRegions.layer) layers.crudeRegions.layer.setVisible(visibility);
  };

  // Creates the entire port prediction tree and ties together the parent-child node
  // relationships. The selected vessel is replicated and then the root node is created using
  // this copied feature. Since the tree needs to display 3 port predictions at a time,
  // each node has exactly 3 child nodes.
  //
  // Each node holds a reference to the layer the feature is being held inside. This must be done
  // in order for the hiding/showing of the tree layers to work properly depending on the port
  // selection as the tree is being displayed.
  //
  // Arguments
  //      * portPredictionData -> dictionary, port prediction json data
  //      * selectedVessel -> OpenLayers feature object, vessel that is currently being viewed
  this.createPortPredictionTreeLayers = function(portPredictionData, selectedVessel) {
    var vesselStyle = map.styleManager.getVesselStyle(selectedVessel.get("data")["cargo_type"]),
      selectedVesselReplica = map.featureManager.portPredictionFeatures.createPortPredictionVesselFeature(selectedVessel, vesselStyle),
      headLayer = _createPortPredictionTreeLayer(selectedVesselReplica, {
        zIndex: 3
      });
    // assign our head layer to be only the selected vessel
    layers.portPredictionTree = new PortPredictionTreeNode(headLayer);
    // set our main feature
    layers.portPredictionTree.mainFeature = selectedVesselReplica[0];
    // set our unique id
    layers.portPredictionTree.uniqueId = "";
    layers.portPredictionTree.uniqueId_suffix = "-prediction";
    // set our class
    layers.portPredictionTree.class = "vessel-prediction";
    // set the level
    layers.portPredictionTree.level = 3;
    // set our head node to our feature
    selectedVesselReplica[0].set("node", layers.portPredictionTree);
    // create a queue to hold reference to the nodes in line
    // to generate their children.
    var queue = new Queue(),
      index = 0,
      zIndex = 2;
    queue.enqueue(layers.portPredictionTree);
    // loop through our port prediction data and build our tree
    while (!queue.isEmpty() && index < portPredictionData.length) {
      var size = queue.getLength();
      for (var i = 0; i < size; i++) {
        var node = queue.dequeue();
        // create our child nodes for the currently dequeued node
        var childNode1 = _createNodeWithLayer(portPredictionData[index++], node, zIndex, 1),
          childNode2 = _createNodeWithLayer(portPredictionData[index++], node, zIndex, 2),
          childNode3 = _createNodeWithLayer(portPredictionData[index++], node, zIndex, 3);
        // add our children to the parent node list
        node.children.push(childNode1, childNode2, childNode3);
        // add our child nodes to the queue
        queue.enqueue(childNode1);
        queue.enqueue(childNode2);
        queue.enqueue(childNode3);
      }
      --zIndex;
    }
  };

  // Determines which node in the tree that is currently being displayed AND
  // is being looped to a port that is already being displayed. This is used for when
  // a user is viewing the final level of the port prediction tree and one of the ports
  // is presented in multiple prediction levels.
  //
  // Arguments
  //      * portNode -> PortPredictionTreeNode object, port node that is being hovered/selected
  //
  // Returns a PortPredictionTreeNode object
  this.getPortPredictionLoopNode = function(portNode) {
    var queue = new Queue();
    for (var i = 0; i < portNode.children.length; i++) queue.enqueue(portNode.children[i]);
    while (!queue.isEmpty()) {
      var node = queue.dequeue();
      if (node.layer.getVisible()) {
        if (node.mainFeature.get("data")["name"] == portNode.mainFeature.get("data")["name"]) {
          return node;
        } else {
          for (var i = 0; i < node.children.length; i++) queue.enqueue(node.children[i]);
        }
      }
    }
    return null;
  };

  // Hides parent-child layers that are not contained in the current node layer.
  //
  // Arguments
  //      * node -> PortPredictionTreeNode object, clicked node in the tree that
  //                needs its parent's children removed from the map
  this.hidePortPredictionTreeParentChildren = function(node) {
    var parentChildren = node.parentNode.children;
    for (var i = 0; i < parentChildren.length; i++) {
      if (parentChildren[i].ranking != node.ranking) {
        parentChildren[i].layer.setVisible(false);
        // $("#" + parentChildren[i].uniqueId).removeClass();
        // $("#" + parentChildren[i].uniqueId).addClass("port-prediction-default");
        parentChildren[i].selected = false;
      }
    }
  };

  // If the user clicks backward, or in other words to a node that has already
  // had its children expanded, we must remove all layers below.
  //
  // Arguments
  //      * node -> PortPredictionTreeNode object, clicked node in the tree
  this.hidePortPredictionTreeBelow = function(node) {
    var queue = new Queue();
    for (var i = 0; i < node.children.length; i++) queue.enqueue(node.children[i].children);
    while (!queue.isEmpty()) {
      var children = queue.dequeue();
      for (var i = 0; i < children.length; i++) {
        children[i].layer.setVisible(false);
        // $("#" + children[i].uniqueId).removeClass();
        // $("#" + children[i].uniqueId).addClass("port-prediction-default");
        queue.enqueue(children[i].children);
      }
      children.selected = false;
    }
  };

  // Show all child layers of the selected port prediction node
  //
  // Arguments
  //      * node -> PortPredictionTreeNode object, clicked node in the tree that needs
  //                its children visible
  this.showPortPredictionTreeChildren = function(node) {
    // remove class "currently selected" from all previous
    // $(".currentlySelected").removeClass("currentlySelected");
    // add class "currently selected" to current
    // $("#" + node.uniqueId).addClass("currentlySelected");
    // change the line and port style of the selected node if the node is not the head node
    if (node.level !== 3) {
      var features = node.layer.getSource().getFeatures();
      if (node.level === 0) {
        features[2].setStyle(map.styleManager.getPortStyle());
      } else {
        if (features[0].get("type") === map.type.PORT_PREDICTION) {
          features[0].setStyle(map.styleManager.getPortStyle());
          features[1].setStyle(map.styleManager.getPortPredictionLevelLineSelectedStyle(false));
        } else {
          features[1].setStyle(map.styleManager.getPortStyle());
          features[0].setStyle(map.styleManager.getPortPredictionLevelLineSelectedStyle(false));
        }
      }
      node.selected = true;
    }

    // iterate over the children of the selected node and set their layers to be visible
    for (var i = 0; i < node.children.length; i++) {
      node.children[i].layer.setVisible(true);
      // $("#" + node.children[i].uniqueId).removeClass();
      // $("#" + node.children[i].uniqueId).addClass(node.children[i].class);
      // change layer feature back to original styles
      var portStyle = map.styleManager.getPortPredictionLevelPortStyle(node.children[i].ranking - 1, 0, node.children[i].ranking);
      var features = node.children[i].layer.getSource().getFeatures();
      if (features[0].get("type") === map.type.PORT_PREDICTION) {
        features[0].setStyle(portStyle);
        features[1].setStyle(map.styleManager.getPortPredictionLevelLineStyle(node.children[i].ranking - 1, false));
      } else {
        features[1].setStyle(portStyle);
        features[0].setStyle(map.styleManager.getPortPredictionLevelLineStyle(node.children[i].ranking - 1, false));
      }
      node.children[i].selected = false;
    }
  };

  // Retrieves the port prediction tree node by the unique port id of the port predictions.
  // We select a node individually because when a user clicks on the sidebar tree,
  // we need access to the node in order to perform the appropriate action.
  //
  // Arguments
  //      * portId -> string, unique port id for the port prediction
  //
  // Returns a PortPredictionTreeNode object, the node matching the portId
  this.getPortPredictionTreeNodeByPortId = function(portId) {
    var queue = new Queue(),
      head = layers.portPredictionTree;
    queue.enqueue(head);
    while (!queue.isEmpty()) {
      var node = queue.dequeue();
      if (node.uniqueId != null && node.uniqueId == portId) return node;
      for (var i = 0; i < node.children.length; i++) queue.enqueue(node.children[i]);
    }
    return null;
  };

  // Discovers which port prediction nodes within the tree are visible on the map.
  //
  // Returns an array of PortPredictionTreeNode objects, ones that are visible
  this.getVisiblePortPredictionNodes = function() {
    var queue = new Queue(),
      head = layers.portPredictionTree,
      nodes = [];
    queue.enqueue(head);
    while (!queue.isEmpty()) {
      var node = queue.dequeue();
      if (node.layer.getVisible()) nodes.push(node);
      for (var i = 0; i < node.children.length; i++) queue.enqueue(node.children[i]);
    }
    return nodes;
  };

  // Creates a tile layer using OpenStreetMap
  //
  // Return OpenLayers Tile layer object
  this.createTileLayer = function() {
    return new ol.layer.Tile({
      source: new ol.source.OSM({
        // disable horizontal repeat on map, if enabled, it makes
        // the lines for the journeys look strange
        wrapX: false
      })
    });
  };

  // Creates a geo json layer on the map with various borders around all countries.
  // A style function is applied to the layer in which the name of the country is passed
  // in.
  //
  // Returns OpenLayers layer object, specifically the countries.layer
  this.createCountryGeoJsonLayer = function() {
    layers.countries.layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: "static/geojson/countries.min.geojson",
        format: new ol.format.GeoJSON()
      }),
      visible: false,
      style: function(feature) {
        return map.styleManager.getCountryInactiveStyle(feature.get("name"));
      }
    });
    return layers.countries.layer;
  };

  // Creates a geo json layer on the map with various borders around all crude regions.
  // A style function is applied to the layer in which the name of the crude region is passed
  // in.
  //
  // Returns OpenLayers layer object, specifically the crudeRegions.layer
  this.createCrudeRegionGeoJsonLayer = function() {
    layers.crudeRegions.layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: "static/geojson/crude-regions.min.geojson",
        format: new ol.format.GeoJSON()
      }),
      visible: false,
      style: function(feature) {
        return map.styleManager.getCrudeRegionInactiveStyle(feature.get("name"));
      }
    });
    return layers.crudeRegions.layer;
  };

  // Creates the vessel layer and add sit to the map.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Cluster Source -> AnimatedCluster Layer
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects, vessel features
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createVesselsLayer = function(features, args) {
    _createLayerHelper(features, args, layers.vessels);
  };

  // Creates the ports layer and adds it to the map.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Cluster Source -> AnimatedCluster Layer
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects, port features
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createPortsLayer = function(features, args) {
    _createAnimatedClusterLayerHelper(features, args, layers.ports, map.styleManager.getPortClusterStyle);
  };

  // Creates the journey zoom range layer.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Vector Layer
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects, zoom range features for journeys
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createJourneyZoomRangeLayer = function(features, args) {
    _createLayerHelper(features, args, layers.journeyZoomRange);
  };

  // Creates port threshold layer.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Vector Layer
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects, port threshold features
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createPortThresholdLayer = function(features, args) {
    _createLayerHelper(features, args, layers.portThreshold);
  };

  // Creates journey hover position layer.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Vector Layer
  //
  // Arguments
  //      * features -> array of a single OpenLayers feature object, hover feature for a journey
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createJourneyHoverPositionLayer = function(features, args) {
    _createLayerHelper(features, args, layers.journeyHover);
  };

  // Creates a past journey layer.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Vector Layer
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects, past journey features
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createPastJourneyLayer = function(features, args) {
    _createLayerHelper(features, args, layers.pastJourneys);
  };

  // Creates current journey layer.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Vector Layer
  //
  // Arguments
  //      * features -> array of a single OpenLayers feature object, hover feature for a journey
  //      * args -> dictionary, used for setting the layer with specific parameters
  this.createCurrentJourneyLayer = function(features, args) {
    _createLayerHelper(features, args, layers.currentJourney);
  };

  this.createVesselsDensityLayer = function(features, args) {
    var vectorSource = _createVectorSource(features);
    // assign key 'layer' to the heatmap layer
    var heatmapLayer = _createHeatmapLayer(vectorSource, 15, 5);
    // set args to the layer
    heatmapLayer = _setLayerArguments(heatmapLayer, args);
    // set the key 'layer' to our created layer
    layers.vesselsDensity.layer = heatmapLayer;
    // add the layer to the map
    _addLayerToMap(heatmapLayer);
  };

  // Removes the journey hover layer.
  this.removeJourneyHoverPositionLayer = function() {
    _removeLayerHelper(layers.journeyHover);
  };
  // Remove the vessels layer.
  this.removeVesselsLayer = function() {
    _removeLayerHelper(layers.vessels);
  };

  // Removes the ports layer.
  this.removePortsLayer = function() {
    _removeLayerHelper(layers.ports);
  };

  // Removes the journey zoom range layer.
  this.removeJourneyZoomRangeLayer = function() {
    _removeLayerHelper(layers.journeyZoomRange);
  };

  // Removes the port threshold layer.
  this.removePortThresholdLayer = function() {
    _removeLayerHelper(layers.portThreshold);
  };

  // Removes and clears the past journeys layers.
  this.removePastJourneysLayers = function() {
    _removeLayerHelper(layers.pastJourneys);
  };

  // Removes the current journey layer.
  this.removeCurrentJourneyLayer = function() {
    _removeLayerHelper(layers.currentJourney);
  };

  this.removeVesselsDensityLayer = function() {
    _removeLayerHelper(layers.vesselsDensity);
  };

  // Removes all port prediction layers.
  this.removePortPredictionLayer = function() {
    if (layers.portPredictionTree == null) return;
    // iterate over each level of our tree and remove each layer
    // from the map
    var queue = new Queue(),
      head = layers.portPredictionTree;
    queue.enqueue(head);
    while (!queue.isEmpty()) {
      var node = queue.dequeue();
      _removeLayerFromMap(node.layer);
      for (var i = 0; i < node.children.length; i++) queue.enqueue(node.children[i]);
    }
    // set our port prediction tree to null
    layers.portPredictionTree = null;

    // $("#port-prediction-lists").empty();
  };

  // Hide the past journeys layers excluding the given
  // index. This is called when a user selected a past journey.
  //
  // Arguments
  //      * layerIdx -> integer, represents the index of the past journey layer
  this.hidePastJourneysLayersExcludingIndex = function(layerIdx) {
    if (layers.pastJourneys.length == 0) return;
    for (var i = 0; i < layers.pastJourneys.length; i++) if (layerIdx != i) layers.pastJourneys[i].setVisible(false);
  };

  // Sets the paginated journey layers to be true. Since there is
  // a max of 3 journeys per page, a max of 3 journeys can be set to true.
  this.showPastJourneysLayers = function(paginationContainer) {
    var data = paginationContainer.pagination("getSelectedPageData");
    for (var i = 0; i < data.length; i++) data[i].setVisible(true);
  };

  // Returns an OpenLayers layer object by id. If the id
  // is not null, that means a past journey is attempting to be accessed.
  this.getJourneyLayerById = function(id) {
    return id != null ? layers.pastJourneys[id] : layers.currentJourney.layer;
  };

  // Creates a PortPredictionTreeNode with a layer, main feature (the port prediction feature or vessel feature),
  // assigned parent node, ranking, unique id, class name, and line styles being used in the layer.
  // The port prediction features are created and added to the the layer in which are then applied a style.
  //
  // Arguments
  //      * portData -> dictionary, port prediction json data
  //      * parentNode -> PortPredictionTreeNode Object, parent node of the current created node
  //      * zIndex -> integer, represents the rendering order of the newly created layer
  //      * choice -> integer, between 1 and 3, represents the ranking of the port prediction
  //
  // Returns a PortPredictionTreeNode object
  let _createNodeWithLayer = function(portData, parentNode, zIndex, choice) {
    // Get the main feature of the node (either port or vessel feature)
    var parentNodeFeature = parentNode.mainFeature,
      // extracts the lon/lat pair from the feature
      lastParentLayerFeatureCoords = [parentNodeFeature.get("data")["lon"], parentNodeFeature.get("data")["lat"]],
      // extract the lon/lat pair from the incoming port data
      portCoords = [portData["lon"], portData["lat"]],
      // build the line string coordinates using the extracting lon/last pairs from the portData and lastParentLayerFeature
      lineStringCoords = [lastParentLayerFeatureCoords, portCoords],
      // retrieve the port prediction port style based on the choice
      portPredictionPortStyle = map.styleManager.getPortPredictionLevelPortStyle(choice - 1, 0, choice),
      // creates the port prediction feature using the portData and applies the port prediction style
      portPredictionFeature = map.featureManager.portPredictionFeatures.createPortPredictionPortFeature(portData, portCoords, choice, portPredictionPortStyle),
      // create an array containing the line feature holding [feature, style].
      lineFeatureStraight = map.featureManager.portPredictionFeatures.createPortPredictionLineFeature(lineStringCoords[0], lineStringCoords[1], 2, false, choice - 1),
      // create an array containing the line feature arc for the last level in the tree and the style.
      lineFeatureArc = map.featureManager.portPredictionFeatures.createPortPredictionLineFeature(lineStringCoords[0], lineStringCoords[1], 100, true, choice - 1),
      // combines both of the features created above. Depending on if our zIndex is 0 or not (i.e. we are at the last level in the tree),
      // the line feature arc is discarded from the layer features or it is added. Only the final level in the tree should have a line arc
      // feature because that is the only level that could possibly have a loop.
      layerFeatures = zIndex == 0 ? [lineFeatureStraight[0], lineFeatureArc[0], portPredictionFeature] : [lineFeatureStraight[0], portPredictionFeature],
      // creates the port prediction tree layer using the combined features and sets arguments for the layer
      layer = _createPortPredictionTreeLayer(layerFeatures, {
        zIndex: zIndex,
        visible: false
      }),
      // finally, creates the node using the created layer
      node = new PortPredictionTreeNode(layer);
    // set parent node
    node.parentNode = parentNode;
    // set main feature
    node.mainFeature = portPredictionFeature;
    // set ranking
    node.ranking = choice;
    // set the level
    node.level = zIndex;
    // set unique id
    node.uniqueId = (parentNode.uniqueId ? parentNode.uniqueId+";" : "") + "pp" + portData["id_name"];
    // set the color for the node
    node.class = ""; //choice == 1 ? "port-prediction-first" : choice == 2 ? "port-prediction-second" : "port-prediction-third";
    // set our line styles
    node.lineStyles = lineFeatureArc[1];
    // set both of our features to have the node as a property.
    // we must do this because when a user clicks on the feature, we can easily
    // hide/show the child layers without traversing the tree each time
    portPredictionFeature.set("node", node);
    return node;
  };

  // Helper function for creating a port prediction tree
  // layer and adding it to the map.
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects, port prediction feature and line string feature
  //      * args -> dictionary, used for setting the layer with specific parameters
  //
  // Returns an OpenLayers layer object
  let _createPortPredictionTreeLayer = function(features, args) {
    var vectorSource = _createVectorSource(features);
    // assign key 'layer' to the vector layer
    var vectorLayer = _createVectorLayer(vectorSource);
    // set args to the layer
    vectorLayer = _setLayerArguments(vectorLayer, args);
    // add layer to map
    _addLayerToMap(vectorLayer);
    // return the vector layer
    return vectorLayer;
  };

  // Helper function to create a layer. Since the layer being
  // passed in is a dictionary, the layer is being passed in by reference.
  // Thus, we can assign the key 'layer' to the the Vector Layer and
  // it will update the dictionary's contents without having to return
  // anything.
  //
  // Structure of the layer:
  //      Features -> Vector Source -> Vector Layer
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects
  //      * args -> dictionary, used for setting the layer with specific parameters
  //      * layer -> dictionary OR array, used as a wrapper for the OpenLayers layer object
  let _createLayerHelper = function(features, args, layer) {
    var vectorSource = _createVectorSource(features);
    // assign key 'layer' to the vector layer
    var vectorLayer = _createVectorLayer(vectorSource);
    // set args to the layer
    vectorLayer = _setLayerArguments(vectorLayer, args);
    // set our layers to the created vector layer
    if (layer === layers.pastJourneys) layer.push(vectorLayer);
    else layer.layer = vectorLayer;
    // add the layer to the map
    _addLayerToMap(vectorLayer);
  };

  // Creates an Animated Cluster Layer. The structure of the layer is
  // features -> vector source -> cluster source -> animated cluster layer.
  //
  // Arguments
  //      * features -> array of OpenLayers feature objects
  //      * args -> dictionary, used for setting the layer with specific parameters
  //      * layer -> dictionary, used as a wrapper for the layer
  //      * stylingMethod -> function, represents the styling method that will be used for the features
  let _createAnimatedClusterLayerHelper = function(features, args, layer, stylingMethod) {
    // create vector source
    var vectorSource = _createVectorSource(features);
    // create cluster source using vector source
    var clusterSource = _createClusterSource(vectorSource, 100);
    // create animated cluster using cluster source layer
    var clusterSourceLayer = _createAnimatedClusterLayer(clusterSource, 700, stylingMethod);
    // set args for the created layer
    clusterSourceLayer = _setLayerArguments(clusterSourceLayer, args);
    // set our layer
    layer.layer = clusterSourceLayer;
    // add layer to map
    _addLayerToMap(layer.layer);
  };

  // Helper function for creating the animated cluster layer.
  // An animated cluster layer uses the cluster source, animation duration,
  // and styling function upon creation.
  //
  // Arguments
  //      * source -> OpenLayers cluster object, holds the vector source with features
  //      * animationDuration -> integer, animation length in milliseconds
  //      * style -> function, represents the styling method being used for the features
  //
  // Returns animated cluster object
  let _createAnimatedClusterLayer = function(source, animationDuration, style) {
    return new ol.layer.AnimatedCluster({
      source: source,
      animationDuration: animationDuration,
      style: style
    });
  };

  // Sets the zIndex argument and visibility argument for a layer
  // depending on if it is present inside of the args dictionary.
  //
  // Arguments
  //      * layer -> OpenLayers layer object
  //      * args -> dictionary, potentially holds the keys 'zIndex' and 'visible'
  //
  // Returns OpenLayers layer object
  let _setLayerArguments = function(layer, args) {
    if ("zIndex" in args) layer.setZIndex(args.zIndex);
    if ("visible" in args) layer.setVisible(args.visible);
    return layer;
  };

  // Creates a vector layer using the passed in source.
  let _createVectorLayer = function(source) {
    return new ol.layer.Vector({
      source: source,
      renderMode: "image"
    });
  };

  let _createHeatmapLayer = function(source, blur, radius) {
    return new ol.layer.Heatmap({
      source: source,
      blur: parseInt(blur, 10),
      radius: parseInt(radius, 10)
    });
  };

  // Creates the cluster source using the vector source passed in
  // as well as the distance.
  //
  // Arguments
  //      * source -> OpenLayers vector source object, holding the features for the layer
  //      * distance -> integer, represents the distance at which features should be clustered.
  //                    by default, the distance is set to 20.
  let _createClusterSource = function(source, distance) {
    return new ol.source.Cluster({
      distance: distance, // default is 20
      source: source
    });
  };

  // Creates the vector source using the array of features passed in.
  let _createVectorSource = function(features) {
    return new ol.source.Vector({
      features: features,
      projection: "EPSG:4326"
    });
  };

  // Helper function to remove a layer. Since the passed in layer is
  // a dictionary, it is being passed by reference. We can then
  // assign the key 'layer' to null and this will alter the contents
  // of the dictionary without having to return anything.
  let _removeLayerHelper = function(layer) {
    if (layer === layers.pastJourneys) {
      if (layers.pastJourneys.length === 0) return;
      for (var i = 0; i < layers.pastJourneys.length; i++) _removeLayerFromMap(layers.pastJourneys[i]);
      layers.pastJourneys = [];
    } else {
      if (layer.layer == null) return;
      _removeLayerFromMap(layer.layer);
      layer.layer = null;
    }
  };

  // Helper function for removing a layer from the map.
  let _removeLayerFromMap = function(layer) {
    map.getMap().removeLayer(layer);
  };

  // Helper function for adding a layer to the map.
  let _addLayerToMap = function(layer) {
    map.getMap().addLayer(layer);
  };

  return this;
}

// Object for representing a PortPredictionTree Node.
// The object is created using a OpenLayers layer object.
//
// Attributes
//      * layer -> OpenLayers layer object
//      * mainFeature -> OpenLayers feature object, either a port prediction or vessel feature
//      * ranking -> integer, 1 to 3, represents the choice for the port prediction
//                   in comparison to the other predictions in the same level
//      * parentNode -> PortPredictionTreeNode -> references the parent node
//      * uniqueId -> string, represents the unique identifier for the node. In this case,
//                    the unique id of the port prediction nodes is the port id of the port.
//                    This is needed because the tree created in the sidebar needs a way for each
//                    node to be accessed individually.
//      * class -> string, used so the colors can be applied using CSS
//      * children -> array of PortPredictionTreeNodes, children of the current node
//      * lineStyles -> array of OpenLayers Style objects, represents the styles that were applied
//                      to the line string features in the layer
//      * level -> integer, represents the level of the node between 0 and 3
function PortPredictionTreeNode(layer) {
  this.layer = layer;
  this.mainFeature = null;
  this.ranking = null;
  this.parentNode = null;
  this.uniqueId = null;
  this.class = null;
  this.children = [];
  this.lineStyles = null;
  this.level = 0;
  this.selected = false;
}

// Handles all of the styling for the features
// that are being applied to the layers on the OpenLayers map.
function StyleManager() {
  // The meaning of "this" changes during callbacks, so save its original value
  let that = this;

  // Holds the styles that are set for past journeys. Since there are
  // three features for each journey (start feature, line feature, end feature),
  // each feature holds two styles (one for hover styling, one for non-hover styling).
  // The journey has the possibility to have a fourth feature, specifically a dashed line
  // showing missing data in the beginning or end of the journey.
  // The two dimensional array of styles are paired with the journey layer index that
  // is pertaining to the features in the layer. The structure of the array is
  // [[[color1-feature1-style1, color1-feature1-style2], [color1-feature2-style1, color1-feature2-style2], [color1-style1, color1-style2]], ...]
  let _pastJourneysStyles = [[[], [], []], [[], [], []], [[], [], []], [[], [], []]];

  // References all colors being used for the past journeys style features.
  // Each array holds the RGBA (Red-Green-Blue-Alpha) values in which
  // are then applied to the styles.
  let _pastJourneysColors = [[[25, 150, 255, 1], [25, 150, 255, 0.05]], [[255, 0, 155, 1], [255, 0, 155, 0.05]], [[255, 219, 19, 1], [255, 219, 19, 0.05]]];

  // Vessel gasoline style when the feature is hovered/selected.
  let _vesselGasolineStyle = null;

  // Vessel crude style when the feature is hovered/selected.
  let _vesselCrudeStyle = null;

  // Vessel unkown style
  let _vesselUnkownStyle = null;

  // Vessel selected style
  let _vesselSelectedStyle = null;

  // Port default style.
  let _portStyle = null;

  // Port style for when it is selected.
  let _portSelectedStyle = null;

  // Starting style of the current journey of a vessel.
  let _currentJourneyStartStyle = null;

  // Line (or middle) style of the current journey of a vessel.
  let _currentJourneyLineStyle = null;

  // End style of the current journey of a vessel.
  let _currentJourneyEndStyle = null;

  // Cache that holds the port cluster styles.
  // The key of the dictionary is the size of the cluster,
  // while the value is the actual style.
  let _portClusterStyleCache = {};

  // Cache that holds the vessel cluster styles.
  // The key of the dictionary is the size of the cluster,
  // while the value is the actual style.
  let _vesselClusterStyleCache = {};

  // Port distance threshold array styles.
  // The styles are orange, red, and green circle styles.
  let _portDistanceThresholdStyles = [];

  // Small style that appears over a journey when hovering over
  // the time series of a selected journey.
  let _journeyHoverStyle = null;

  // Style that appears over a journey when selecting a portion
  // of the time series of a selected journey.
  let _journeyZoomRangeStartStyle = null;

  let _journeyZoomRangeEndStyle = null;

  // Holds the colors for the port prediction level colors. Each level
  // in the port prediction should have Red, Yellow, and Green.
  let _portPredictionLevelColors = [["hsl(120, 100%, 40%)", "hsl(120, 100%, 60%)"], ["hsl(50, 98%, 49%)", "hsl(50, 98%, 69%)"], ["hsl(3, 75%, 66%)", "hsl(3, 75%, 86%)"]];

  // Returns the default style of the feature depending on what the feature type of the feature is.
  // We do this in order to reset the hovered feature each time a call is made to map._onMapPointerMove.
  //
  // Arguments
  //      * hoveredFeature -> OpenLayers feature
  this.getHoveredFeatureDefaultStyle = function(hoveredFeature) {
    var featureType = map.determineFeatureType(hoveredFeature);
    if (featureType == map.type.PORT) return that.getPortStyle();
    if (featureType == map.type.PORT_PREDICTION) return hoveredFeature.get("node").selected ? that.getPortStyle() : that.getPortPredictionLevelPortStyle(hoveredFeature.get("node").ranking - 1, 0, hoveredFeature.get("node").ranking);
    if (featureType == map.type.VESSEL) return that.getVesselStyle(hoveredFeature.get("data")["cargo_type"]);
    if (featureType == map.type.COUNTRY) return that.getCountryInactiveStyle(hoveredFeature.get("name"));
    if (featureType == map.type.CRUDE_REGION) return that.getCrudeRegionInactiveStyle(hoveredFeature.get("name"));
    return null;
  };

  // Returns OpenLayers Style object, represents the region styling for
  // when a user has hovered over the feature. The name of the region is then applied
  // to the style.
  //
  // Arguments
  //      * name -> string, name of the region
  this.getCountryActiveStyle = function(name) {
    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgba(255, 99, 71)",
        width: 1
      }),
      fill: new ol.style.Fill({
        color: "rgba(255, 99, 71, 0.1)"
      }),
      text: new ol.style.Text({
        font: "12px Calibri,sans-serif",
        fill: new ol.style.Fill({
          color: "#000"
        }),
        stroke: new ol.style.Stroke({
          color: "rgba(255, 99, 71)",
          width: 3
        })
      })
    });
    style.getText().setText(name);
    return style;
  };

  // Returns OpenLayers Style object, represents the region styling for
  // when a user is not hovered over the feature. The name of the region is then applied
  // to the style.
  //
  // Arguments
  //      * name -> string, name of the region
  this.getCountryInactiveStyle = function(name) {
    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 0.6)"
      }),
      stroke: new ol.style.Stroke({
        color: "#319FD3",
        width: 1
      }),
      text: new ol.style.Text({
        font: "12px Calibri,sans-serif",
        fill: new ol.style.Fill({
          color: "#000"
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 3
        })
      })
    });
    style.getText().setText(name);
    return style;
  };

  this.getCrudeRegionActiveStyle = function(name) {
    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgba(255, 99, 71)",
        width: 1
      }),
      fill: new ol.style.Fill({
        color: "rgba(255, 99, 71, 0.1)"
      }),
      text: new ol.style.Text({
        font: "12px Calibri,sans-serif",
        fill: new ol.style.Fill({
          color: "#000"
        }),
        stroke: new ol.style.Stroke({
          color: "rgba(255, 99, 71)",
          width: 3
        })
      })
    });
    style.getText().setText(name);
    return style;
  };

  this.getCrudeRegionInactiveStyle = function(name) {
    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: "rgba(255, 255, 255, 0.6)"
      }),
      stroke: new ol.style.Stroke({
        color: "#319FD3",
        width: 1
      }),
      text: new ol.style.Text({
        font: "12px Calibri,sans-serif",
        fill: new ol.style.Fill({
          color: "#000"
        }),
        stroke: new ol.style.Stroke({
          color: "#fff",
          width: 3
        })
      })
    });
    style.getText().setText(name);
    return style;
  };

  // Returns a string, representing the a color in hsl of the requested port prediction
  // level.
  //
  // Arguments
  //      * probabilityIndex -> integer, represents the index of the ranking in port prediction.
  //                            The ranking can be from 0 to 2 where 0 is green, 1 is yellow, and 2
  //                            is red.
  //      * hoverIndex -> integer, represents the index of the array of hsl colors. The number can be
  //                      either 0 or 1 where 0 is the darker color and 1 is the lighter color.
  this.getPortPredictionLevelColor = function(probabilityIndex, hoverIndex) {
    return _portPredictionLevelColors[probabilityIndex][hoverIndex];
  };

  // Returns an OpenLayers Style object, creating a circle with text inside.
  //
  // Arguments
  //      * probabilityIndex -> integer, represents the index of the ranking in port prediction.
  //                            The ranking can be from 0 to 2 where 0 is green, 1 is yellow, and 2
  //                            is red.
  //      * hoverIndex -> integer, represents the index of the array of hsl colors. The number can be
  //                      either 0 or 1 where 0 is the darker color and 1 is the lighter color.
  //      * ranking -> integer, between 1 and 3, represents the ranking of the port prediction that
  //                   is displayed inside of the circle.
  this.getPortPredictionLevelPortStyle = function(probabilityIndex, hoverIndex, ranking) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 15,
        fill: new ol.style.Fill({
          color: that.getPortPredictionLevelColor(probabilityIndex, hoverIndex)
        })
      }),
      text: new ol.style.Text({
        text: ranking.toString(),
        fill: new ol.style.Fill({
          color: "#fff",
          fontWeight: "bold",
          fontSize: "14"
        })
      })
    });
  };

  // Sets a style to the straight line feature or arc line feature for a given node.
  // If one of the features has a style, that means the other style has no style applied to it.
  // Unfortunately, OpenLayers does not have a way to hide/show features, thus the next best thing
  // was to apply an empty style object to "hide" the object.
  this.determinePortPredictionLevelLineStyle = function() {
    var nodes = map.layerManager.getVisiblePortPredictionNodes();
    var set = {};
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var features = node.layer.getSource().getFeatures();
      var portFeature = features[features.length - 1];
      if (node.level == 0) {
        if (!node.selected) node.mainFeature.setStyle(that.getPortPredictionLevelPortStyle(node.ranking - 1, 0, node.ranking));
        // set an arc style due to there already being a
        // port prediction to that specified port
        if (set[portFeature.get("id")] === true) {
          features[0].setStyle(new ol.style.Style({}));
          features[1].setStyle(node.selected ? [that.getPortPredictionLevelLineSelectedStyle(true), node.lineStyles[1]] : node.lineStyles);
        } else {
          features[0].setStyle(node.selected ? that.getPortPredictionLevelLineSelectedStyle(false) : that.getPortPredictionLevelLineStyle(node.ranking - 1, false));
          features[1].setStyle(new ol.style.Style({}));
        }
      }
      set[portFeature.get("id")] = true;
    }
  };

  // Returns an OpenLayers Style object, a line style either dashed or filled.
  //
  // Arguments
  //      * probabilityIndex -> integer, represents the index of the ranking in port prediction.
  //                            The ranking can be from 0 to 2 where 0 is green, 1 is yellow, and 2
  //                            is red.
  //      * dashed -> boolean, applies a dashed style to the line if true
  this.getPortPredictionLevelLineStyle = function(probabilityIndex, dashed) {
    return dashed
      ? new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 3,
            color: that.getPortPredictionLevelColor(probabilityIndex, 0),
            lineDash: [0.1, 5]
          })
        })
      : new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: that.getPortPredictionLevelColor(probabilityIndex, 0),
            width: 3
          })
        });
  };

  this.getPortPredictionLineArrowShapeStyle = function(apexGeom, rotation) {
    return new ol.style.Style({
      geometry: apexGeom,
      image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
          color: "#000000"
        }),
        points: 3,
        radius: 9,
        rotateWithView: false,
        rotation: -rotation + Math.PI / 2
      })
    });
  };

  this.getPortPredictionLevelLineSelectedStyle = function(dashed) {
    return dashed
      ? new ol.style.Style({
          stroke: new ol.style.Stroke({
            width: 3,
            color: [0, 0, 0, 1],
            lineDash: [0.1, 5]
          })
        })
      : new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: [0, 0, 0, 1],
            width: 3
          })
        });
  };

  // Returns an OpenLayers Style object, specifically a vessel icon.
  this.getVesselStyle = function(cargoType) {
    if (cargoType === "GASOLINE") {
      if (_vesselGasolineStyle === null) {
        _vesselGasolineStyle = new ol.style.Style({
          image: new ol.style.Icon({
            src: "static/images/map-icons-custom/ship-gasoline.svg",
            scale: 0.3
          })
        });
      }
      return _vesselGasolineStyle;
    } else if (cargoType === "CRUDE") {
      if (_vesselCrudeStyle === null) {
        _vesselCrudeStyle = new ol.style.Style({
          image: new ol.style.Icon({
            src: "static/images/map-icons-custom/ship-crude.svg",
            scale: 0.3
          })
        });
      }
      return _vesselCrudeStyle;
    } else {
      if (_vesselUnkownStyle === null) {
        _vesselUnkownStyle = new ol.style.Style({
          image: new ol.style.Icon({
            src: "static/images/map-icons-custom/ship-unknown.svg",
            scale: 0.3
          })
        });
      }
      return _vesselUnkownStyle;
    }
  };

  this.getSelectedVesselStyle = function() {
    if (_vesselSelectedStyle === null) {
      _vesselSelectedStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: "static/images/map-icons-custom/ship-selected.svg",
          scale: 0.3
        })
      });
    }
    return _vesselSelectedStyle;
  };

  // Returns the zoom range start style. If it has not been
  // accessed before, it will initialize it.
  this.getJourneyZoomRangeStartStyle = function() {
    if (_journeyZoomRangeStartStyle === null) {
      _journeyZoomRangeStartStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: "static/images/letter_s.png",
          scale: 0.6
        })
      });
    }
    return _journeyZoomRangeStartStyle;
  };

  // Returns the zoom range end style. If it has not been
  // accessed before, it will initialize it.
  this.getJourneyZoomRangeEndStyle = function() {
    if (_journeyZoomRangeEndStyle === null) {
      _journeyZoomRangeEndStyle = new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: "fraction",
          anchorYUnits: "pixels",
          src: "static/images/letter_e.png",
          scale: 0.6
        })
      });
    }
    return _journeyZoomRangeEndStyle;
  };

  // Returns the journey hover style.
  this.getJourneyHoverFeatureStyle = function() {
    if (_journeyHoverStyle === null) {
      _journeyHoverStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: [0, 0, 0, 1]
          })
        })
      });
    }
    return _journeyHoverStyle;
  };

  // Alters the past journey styles whenever a user hovers over a journey
  // on the map. It will access the styles by the layer index of the array
  // that.map.layerManager._pastJourneysLayers and swap the hover/un-hover styles.
  //
  // If the layer id is -1, that means no journey is currently being hovered
  // and we must reset all of the journey styles to be their default styles.
  this.changePastJourneysStyles = function(layerId) {
    var layers = map.layerManager.getPastJourneysLayers();
    for (var i = 0; i < layers.length; i++) {
      var colorIndex = i % 3,
        features = map.featureManager.pastJourneysFeatures.getPastJourneyFeaturesById(i),
        opacityStyleIdx = layerId === -1 || i === layerId ? 0 : 1;
      for (var j = 0; j < features.length; j++) {
        var name = features[j].get("name"),
          featureIndex = name === "start" ? 0 : name === "line1" ? 1 : name === "end" ? 2 : 3;
        features[j].setStyle(that.getPastJourneyStyle(featureIndex, colorIndex, opacityStyleIdx));
      }
    }
  };

  // Returns a RGBA array representing the past journey color.
  this.getPastJourneyColor = function(journeyIdx) {
    return _pastJourneysColors[journeyIdx][0];
  };

  // Returns the port style depending on if it is 'active' or not.
  // 'Active' in this case means hovered/selected.
  this.getPortStyle = function() {
    if (_portStyle === null) {
      _portStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: "static/images/map-icons-custom/port.svg",
          scale: 0.3
        })
      });
    }
    return _portStyle;
  };

  this.getSelectedPortStyle = function() {
    if (_portSelectedStyle === null) {
      _portSelectedStyle = new ol.style.Style({
        image: new ol.style.Icon({
          src: "static/images/map-icons-custom/port-selected.svg",
          scale: 0.3
        })
      });
    }
    return _portSelectedStyle;
  };

  // Returns the port distance threshold styles
  this.getPortDistanceThresholdStyles = function() {
    if (_portDistanceThresholdStyles.length == 0) {
      var colors = [[255, 128, 0, 0.3], [255, 0, 0, 0.3], [0, 255, 0, 0.3]];
      for (var i = 0; i < colors.length; i++) {
        var style = new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: colors[i],
            width: 3
          }),
          fill: new ol.style.Fill({
            color: colors[i]
          })
        });
        _portDistanceThresholdStyles.push(style);
      }
    }
    return _portDistanceThresholdStyles;
  };

  // Returns the past journey start style which is a circle with a specific color.
  // The color is extracted using a color and opacity index.
  let _getPastJourneyStartStyle = function(colorIndex, opacityIndex) {
    if (_pastJourneysStyles[0][colorIndex].length < 2) {
      var color = _pastJourneysColors[colorIndex][opacityIndex],
        opacity = color[3],
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: [255, 255, 255, opacity]
            }),
            fill: new ol.style.Fill({
              color: color
            })
          })
        });
      _pastJourneysStyles[0][colorIndex][opacityIndex] = style;
    }
    return _pastJourneysStyles[0][colorIndex][opacityIndex];
  };

  // Returns the past journey line style.
  let _getPastJourneyLineStyle = function(colorIndex, opacityIndex, dashed) {
    if (dashed) {
      if (_pastJourneysStyles[3][colorIndex].length < 2) {
        var color = _pastJourneysColors[colorIndex][opacityIndex],
          lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: color,
              width: 4,
              lineDash: [0.1, 5]
            })
          });
        _pastJourneysStyles[3][colorIndex][opacityIndex] = lineStyle;
      }
      return _pastJourneysStyles[3][colorIndex][opacityIndex];
    } else {
      if (_pastJourneysStyles[1][colorIndex].length < 2) {
        var color = _pastJourneysColors[colorIndex][opacityIndex],
          lineStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: color,
              width: 4
            })
          });
        _pastJourneysStyles[1][colorIndex][opacityIndex] = lineStyle;
      }
      return _pastJourneysStyles[1][colorIndex][opacityIndex];
    }
  };

  // Returns past journey end style.
  let _getPastJourneyEndStyle = function(colorIndex, opacityIndex) {
    if (_pastJourneysStyles[2][colorIndex].length < 2) {
      var color = _pastJourneysColors[colorIndex][opacityIndex],
        opacity = color[3],
        style = new ol.style.Style({
          image: new ol.style.RegularShape({
            stroke: new ol.style.Stroke({
              color: [255, 255, 255, opacity]
            }),
            fill: new ol.style.Fill({
              color: color
            }),
            points: 3,
            radius: 7,
            rotation: Math.PI / 4,
            angle: 0
          })
        });
      _pastJourneysStyles[2][colorIndex][opacityIndex] = style;
    }
    return _pastJourneysStyles[2][colorIndex][opacityIndex];
  };

  // Returns the past journey style by feature index, color index, and opacity index
  this.getPastJourneyStyle = function(featureIndex, colorIndex, opacityIndex) {
    var style = null;
    if (featureIndex === 0) style = _getPastJourneyStartStyle(colorIndex, opacityIndex);
    else if (featureIndex === 1) style = _getPastJourneyLineStyle(colorIndex, opacityIndex, false);
    else if (featureIndex === 2) style = _getPastJourneyEndStyle(colorIndex, opacityIndex);
    else if (featureIndex === 3) style = _getPastJourneyLineStyle(colorIndex, opacityIndex, true);
    return style;
  };

  // Returns the current journey styles and appends
  // each style into an array.
  this.getCurrentJourneyStyles = function() {
    var start = _getCurrentJourneyStartStyle();
    var line = _getCurrentJourneyLineStyle();
    var end = _getCurrentJourneyEndStyle();
    return [start, line, end];
  };

  // Returns the vessel cluster style depending on the size of the cluster
  // itself.
  this.getVesselClusterStyle = function(feature) {
    var size = feature.get("features").length;
    if (!_vesselClusterStyleCache[size]) _vesselClusterStyleCache[size] = _getVesselClusterStyleHelper(size);
    // we must return the style in an array in order
    // for the clustering animation to properly style the animated features
    return [_vesselClusterStyleCache[size]];
  };

  // Helper function to determine the style of the vessel cluster.
  //
  // A cluster size differs by the radius of the circle style. In this case,
  // the min radius is 10 and the max radius is 30.
  let _getVesselClusterStyleHelper = function(size) {
    // if the cluster size is 1, return a vessel style
    if (size == 1) return that.getVesselStyle("default");

    // any other size is considered a cluster, thus should be a circle with a count
    var defaultRadius = 10,
      multiplier = Math.floor(size / 30),
      calc = multiplier * 3 + defaultRadius,
      radius = multiplier == 0 ? defaultRadius : calc < 30 ? calc : 30;

    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        stroke: new ol.style.Stroke({
          color: "#fff"
        }),
        fill: new ol.style.Fill({
          color: "#00CC00" // ShipColor
        })
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: "#fff"
        })
      })
    });
  };

  // Returns the port cluster style depending on the size of the cluster
  // itself.
  this.getPortClusterStyle = function(feature) {
    var size = feature.get("features").length;
    if (!_portClusterStyleCache[size]) _portClusterStyleCache[size] = _getPortClusterStyleHelper(size);
    // we must return the style in an array in order
    // for the clustering animation to properly style the animated features
    return [_portClusterStyleCache[size]];
  };

  // Helper function to determine the style of the vessel cluster.
  //
  // A cluster size differs by the radius of the circle style. In this case,
  // the min radius is 10 and the max radius is 30.
  let _getPortClusterStyleHelper = function(size) {
    // if the cluster size is 1, return an anchor style
    if (size == 1) return that.getPortStyle();

    // any other size is considered a cluster, thus should be a circle with a count
    var defaultRadius = 10,
      multiplier = Math.floor(size / 30),
      calc = multiplier * 3 + defaultRadius,
      radius = multiplier == 0 ? defaultRadius : calc < 30 ? calc : 30;

    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        stroke: new ol.style.Stroke({
          color: "#fff"
        }),
        fill: new ol.style.Fill({
          color: "#ff8c00" // PortColor
        })
      }),
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: "#fff"
        })
      })
    });
  };

  // Returns the current journey start style.
  let _getCurrentJourneyStartStyle = function() {
    if (_currentJourneyStartStyle === null)
      _currentJourneyStartStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({
            color: [0, 125, 125, 1]
          })
        })
      });
    return _currentJourneyStartStyle;
  };

  // Returns the current journey line style.
  let _getCurrentJourneyLineStyle = function() {
    if (_currentJourneyLineStyle === null)
      _currentJourneyLineStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [0, 125, 125, 1],
          width: 4
        })
      });
    return _currentJourneyLineStyle;
  };

  // Returns the current journey end style.
  let _getCurrentJourneyEndStyle = function() {
    if (_currentJourneyEndStyle === null)
      _currentJourneyEndStyle = new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: new ol.style.Fill({
            color: [0, 125, 125, 1]
          }),
          points: 3,
          radius: 7,
          rotation: Math.PI / 4,
          angle: 0
        })
      });
    return _currentJourneyEndStyle;
  };

  return this;
}

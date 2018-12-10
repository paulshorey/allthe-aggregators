function TourWrapper() {
  var tour = new Tour({
    debug: true,
    storage: false,
    backdrop: true,
    backdropPadding: 3,
    delay: 100,
    steps: [
      // Search section steps
      {
        element: "#leftColumn",
        title: "Search Options",
        content: "The map features can be filtered using the search capabilities below."
      },
      {
        element: "#vessel-search-section",
        title: "Vessel Search",
        content: "Multiple values can be entered for each input row for ship data. Once entered, click the green search button to apply the filters."
      },
      {
        element: "#vessel-toggle",
        title: "Vessel Toggle",
        content: "Click on the green toggle to hide and show the vessel features on the map."
      },
      {
        element: ".searchSection-ports",
        title: "Port Search",
        content: "Multiple values can be entered for each input row for port data. Once entered, click the orange search button to apply the filters."
      },
      {
        element: "#port-toggle",
        title: "Port Toggle",
        content: "Click on the orange toggle to hide and show the port features on the map."
      },
      // Vessel slider step
      {
        element: "#vessel-range-slider",
        title: "Vessel Range Slider",
        content: "Drag the slider left and right to modify the dates in which the vessels on the map should show. As soon as the the dates are modified, the map will update immediately.",
        onNext: function(tour) {
          // initialize our vessel window for showing the next steps
          // Just grab the first vessel in the vessels layer for demonstration purposes
          var feature = layerManager
            .getVesselsLayer()
            .getSource()
            .getFeatures()[0];
          map.setSelectedVessel(feature);
          // dispatch to React/Redux
          window.redux_dispatch({
            type: "OPEN_SECTION",
            section: "ship",
            data: feature.get("data")
          });
        }
      },
      // Vessel window steps
      {
        element: "#vessel-imo-header",
        title: "Vessel Info Window",
        content: "Once a vessel feature is clicked on the map, the sidebar displays data about the vessel and different interactions you may do.",
        prev: -1,
        onNext: function(tour) {
          // call the view current journey on click function
          onCurrentVesselJourneyClick();
        }
      },
      // Vessel Current Journey Step
      {
        element: "#current-journey-button",
        title: "Vessel Current Journey",
        content: "Clicking the current journey button displays the journey of the vessel on the map. Once the journey is displayed, you have the option click on the journey on the map to view a plot of the data being displayed.",
        prev: -1,
        onNext: function(tour) {
          // clear the current journey and show the past journeys
          onCurrentVesselJourneyClearClick();
          onPastVesselJourneysClick();
        }
      },
      // Vessel Past Journey Steps
      {
        element: "#past-journeys-section",
        title: "Vessel Past Journeys",
        content: "Clicking the past journeys button displays a section of the past journeys for the vessel.",
        prev: -1
      },
      {
        element: "#past-journeys-search-dates-button",
        title: "Past Journeys Search Dates",
        content: "Optionally, you may enter a start and stop date for filtering the past journeys of the vessel. The initial start and end dates set are the minimum and maximum you may enter."
      },
      {
        element: "#pagination-container",
        title: "Past Journeys Pagination",
        content: "You may page through the past journeys 3 at a time on the map. The displayed journeys are color coded to show which id matches the journey on the map."
      },
      {
        element: "#scrollToThisExportPastJourneys",
        title: "Export Past Journeys",
        content: "Clicking the export button will transform all of the past journey data of the vessel to a csv file saved locally to your machine.",
        onNext: function(tour) {
          onVesselViewPredictedPortsClick();
        }
      },
      // Vessel Prediction Steps
      {
        element: "#predictions-header",
        title: "Vessel Predictions",
        content: "Clicking the view predictions button will open a new predictions window. When this is clicked, all port and vessel data on the map is automatically hidden.",
        prev: -1
      },
      {
        element: "#port-name-header",
        title: "Port Predictions",
        content: "Port predictions are displayed in a tree like structure in both the prediction window and on the map itself. The map and sidebar port prediction structure function bidirectionally; " + "in other words, if you click on the map features or click on the sidebar port prediction structure text, the other will change with it. The port prediction names are color coded to match " + "the line and port features being displayed on the map. Green means the most likely, yellow means second most likely, and red means third most likely."
      },
      {
        element: "#port-prediction-export-button",
        title: "Port Predictions Export",
        content: "Clicking the export button will transform all of the port prediction data of the vessel to a csv file saved locally to your machine.",
        onNext: function(tour) {
          var feature = layerManager
            .getPortsLayer()
            .getSource()
            .getFeatures()[0];
          map.setSelectedPort(feature);
          // dispatch to React/Redux
          window.redux_dispatch({
            type: "OPEN_SECTION",
            section: "port",
            data: feature.get("features")[0].get("data")
          });
        }
      },
      // Port section steps
      {
        element: "#port-info-header",
        title: "Port Info Window",
        content: "Once a port feature is clicked on the map, the sidebar displays data about the port and different interactions you may do.",
        prev: -1
      },
      {
        element: "#port-region-update-section",
        title: "Port Region Update",
        content: "Optionally, you may enter a crude and gasoline region if you do not believe the default values are correct.",
        onNext: function(tour) {
          // show the port distance threshold
          onViewDistanceThresholdClick();
        }
      },
      {
        element: "#port-distance-threshold-button",
        title: "Port Distance Threshold",
        content: "Clicking the distance threshold button will display a feature on the map representing the min/avg/max docking distance to the port.",
        prev: -1,
        onNext: function(tour) {
          // show port metric window
          onPortMetricsButtonClick();
        }
      },
      {
        element: ".leftSection-metrics",
        title: "Port Metrics",
        content: "Clicking the port metrics button will display the import/export/net volume for the port. " + "The same plot will be displayed on the map itself when clicking on a country on the map.",
        prev: -1
      }
    ]
  });

  this.start = function() {
    tour.init();
    tour.restart();
  };

  return this;
}

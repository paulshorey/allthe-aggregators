const uiState = {
  selectedVessel_data: {},
  selectedPort_data: {},
  selectedPortMetrics_data: {},
  countryMetrics_data: {},
  portPredictions_selectedNode_uniqueId: "",
  countryMetrics_data: {},
  portMetrics_data: {},
  auditTrail_data: {},

  pastJourneyPagination_pageNumber: 1,

  leftSections_enabled: new Set(["search", "toggle"]),
  leftSections_expanded: "search",

  searchSections_enabled: new Set(["ships", "ports"]),

  journeyTimeSeries_data: {},
  vesselsDensityPlaybackSlider_length: 0,

  currentJourney_viewing: false,
  portThreshold_viewing: false,

  pastJourneys_featureClicked: ""
};

/*******
 ** STATE
 **
 ** First time reduceState() is called, it will not get any attributes. It will inherit the initialState above
 **
 ** Then, for every dispatched event (action), reducedState() will be called with:
 ** * 1st argument: state = the current state, with any changes that have had occurred
 ** * 2nd argument: action = the action you pass to dispatch(). This action requires a property "type". Other properties can be anything.
 **
 ** The reducer's job is to read each action, and modify the new state based on the properties of that action.
 **
 */
const uiReducer = (state = uiState, action) => {
  var newState = typeof window !== "undefined" ? window.deepCopy(state) : state;

  /*
    DO DEPENDING ON ACTION TYPE:
  */
  switch (action.type) {
    case "CREATE_SECTION":
      newState.leftSections_enabled.delete("toggle");
      switch (action.section) {
        case "ship":
          newState.leftSections_enabled.delete("port");
          newState.leftSections_enabled.delete("pastJourneys");
          newState.leftSections_enabled.delete("predictions");
          newState.leftSections_enabled.delete("metrics");
          newState.selectedVessel_data = action.data;
          newState.journeyTimeSeries_data = {};
          newState.currentJourney_viewing = false;
          newState.pastJourneys_featureClicked = "";
          break;
        case "port":
          newState.leftSections_enabled.delete("ship");
          newState.leftSections_enabled.delete("pastJourneys");
          newState.leftSections_enabled.delete("predictions");
          newState.leftSections_enabled.delete("metrics");
          newState.selectedPort_data = action.data;
          newState.portThreshold_viewing = false;
          newState.journeyTimeSeries_data = {};
          break;
        case "portPrediction":
          newState.leftSections_enabled.delete("port");
          newState.leftSections_enabled.delete("pastJourneys");
          newState.leftSections_enabled.delete("metrics");
          newState.selectedPort_data = action.data;
          newState.portThreshold_viewing = false;
          newState.journeyTimeSeries_data = {};
          break;
        case "pastJourneys":
          newState.leftSections_enabled.delete("predictions");
          newState.currentJourney_viewing = false;
          newState.portThreshold_viewing = false;
          newState.journeyTimeSeries_data = {};
          newState.pastJourneyPagination_pageNumber = 1;
          newState.pastJourneys_featureClicked = action.pastJourneys_featureClicked; // set the past journey feature (vessel or port)
          break;
        case "predictions":
          newState.leftSections_enabled.delete("pastJourneys");
          newState.portPredictions_selectedNode_uniqueId = action.portPredictions_selectedNode_uniqueId;
          newState.journeyTimeSeries_data = {};
          newState.currentJourney_viewing = false;
          break;
      }
      // always do this for each created section
      //    1) Add it to the enabled section
      //    2) Expand it automatically
      newState.leftSections_enabled.add(action.section); // enable section
      newState.leftSections_expanded = action.section; // expand it
      // if only one section enabled (assuming it's "search"), also enable "toggle"
      // if at least two sections are enabled (ex: "search" and "ship"), do not show "toggle"
      if (newState.leftSections_enabled.size < 2) {
        newState.leftSections_enabled.add("toggle");
      }
      break;

    case "OPEN_SECTION":
      switch (action.section) {
        case "search":
          // if we are clicking the search section, that is equivalent to
          // starting completely over. All sections and layers are removed.
          newState.leftSections_enabled.delete("ship");
          newState.leftSections_enabled.delete("port");
          newState.leftSections_enabled.delete("pastJourneys");
          newState.leftSections_enabled.delete("predictions");
          newState.leftSections_enabled.delete("metrics");
          newState.leftSections_enabled.add("toggle");
          newState.journeyTimeSeries_data = {};
          newState.currentJourney_viewing = false,
          newState.portThreshold_viewing = false,
          newState.pastJourneys_featureClicked = "";
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
        case "portPrediction":
          break;
      }
      newState.leftSections_expanded = action.section;
      break;

    case "CLOSE_SECTION":
      // do always
      newState.leftSections_enabled.delete("toggle");
      newState.leftSections_enabled.delete(action.section);
      // do depending on section
      if (action.section) {
        switch (action.section) {
          case "ship":
            // Sections that must (also) be removed:
            //    1) Past Journey Section
            //    2) Prediction Section
            //    2) Plotly Graph
            newState.leftSections_enabled.delete("pastJourneys");
            newState.leftSections_enabled.delete("predictions");
            newState.journeyTimeSeries_data = {};
            break;
          case "port":
            // Sections that must (also) be removed:
            //    1) Past Journey Section
            //    2) Metrics Section
            //    3) Plotly Graph
            newState.leftSections_enabled.delete("pastJourneys");
            newState.leftSections_enabled.delete("metrics");
            newState.journeyTimeSeries_data = {};
            break;
          case "pastJourneys":
            // Sections that must (also) be removed:
            //    1) Past Journey Section
            //    2) Plotly Graph
            newState.leftSections_enabled.delete("pastJourneys");
            newState.journeyTimeSeries_data = {};
            break;
          case "predictions":
            // Sections that must (also) be removed:
            //    1) Ship
            //    2) Port (Predicted)
            // newState.leftSections_enabled.delete("ship");
            newState.leftSections_enabled.delete("portPrediction");
            newState.portPredictions_selectedNode_uniqueId = "";
            break;
        }
        // do always: (after individual actions are done)
        // get last item in set, and expand that item (section):
        newState.leftSections_expanded = Array.from(newState.leftSections_enabled).pop();
      }
      // if only one section enabled (assuming it's "search"), also enable "toggle"
      // if at least two sections are enabled (ex: "search" and "ship"), do not show "toggle"
      if (newState.leftSections_enabled.size < 2) {
        newState.leftSections_enabled.add("toggle");
      }
      break;

    case "SEARCH_SECTION_ENABLE":
      if (action.enabled) {
        newState.searchSections_enabled.add(action.section);
      } else {
        newState.searchSections_enabled.delete(action.section);
      }
      break;

    case "VIEW_CURRENT_JOURNEY":
      newState.currentJourney_viewing = true;
      // close anything related to past journeys
      newState.leftSections_enabled.delete("pastJourneys");
      // close the journey time series if it is open
      newState.journeyTimeSeries_data = {};
      // close anything related to predictions
      newState.leftSections_enabled.delete("predictions");
      break;

    case "CLEAR_CURRENT_JOURNEY":
      newState.currentJourney_viewing = false;
      break;

    case "VIEW_PORT_THRESHOLD":
      newState.portThreshold_viewing = true;
      break;

    case "CLEAR_PORT_THRESHOLD":
      newState.portThreshold_viewing = false;
      break;

    case "JOURNEYTIMESERIES_DATA":
      newState.journeyTimeSeries_data = action.data || {};
      break;

    case "COUNTRY_METRIC_DATA":
      newState.countryMetrics_data = action.data || {};
      break;

    case "VESSELS_DENSITY_PLAYBACK_SLIDER_LENGTH":
      newState.vesselsDensityPlaybackSlider_length = action.length || 0;
      break;

    case "PASTJOURNEY_SELECT":
      newState.pastJourneyPagination_pageNumber = action.pageNumber;
      break;

    case "COUNTRY_METRICS_DATA":
      newState.countryMetrics_data = action.data;
      break;

    case "PORT_METRICS_DATA":
      newState.portMetrics_data = action.data;
      break;

    case "AUDIT_TRAIL_DATA":
      newState.auditTrail_data = action.data;
      break;

    default:
      return state;
  }
  /*
    RETURN (COPY OF) STATE:
  */
  return newState;
};

export default uiReducer;

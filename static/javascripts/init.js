/*
	INITIALIZE THE DOM, after React has run, and componentDidMount()
*/
var exporter = new Exporter();
var campaignClock = new CampaignClock();
// map
var map = new OurMap(new StyleManager(), new FeatureManager(), new LayerManager());
map.init();

// map ajax
var AJAX = new MapAjaxInterface();

// map auto size
setInterval(function() {
  map.getMap().updateSize();
}, 1000);

// map auto size
window.onresize = function() {
  map.getMap().updateSize();
};

/**
 * Initial data
 */
document.body.classList.add("mapLoading");
redux_dispatch(uiActionCreators.onLoad())
  .catch(() => {})
  .then(() => document.body.classList.remove("mapLoading"));

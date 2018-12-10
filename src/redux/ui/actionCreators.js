
export const journeyTimeSeries_close = function() {
  return function(dispatch, getState) {
    // ui
    dispatch({
      type: "JOURNEYTIMESERIES_DATA",
      data: {}
    });
  };
};

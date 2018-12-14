// if (process.env.NODE_ENV == "development") { /* we use local FE & BE */ }
// if (process.env.NODE_ENV == "production") { /* we use remote server BE */ }
const USE_PRODUCTION = process.env.NODE_ENV == "production";
// above distinction is made automatically
// if below is true, then we shall use remote server BE, even though running app in development
const STAGE_PRODUCTION = true;
// now get on with the show...

export const RX_LOGIN = function() {
  return function(dispatch, getState) {
    dispatch({
      type: "RX_LOGIN",
      data: {}
    });
  };
};

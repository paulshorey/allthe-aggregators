// if (process.env.NODE_ENV == "development") { /* we use local FE & BE */ }
// if (process.env.NODE_ENV == "production") { /* we use remote server BE */ }
const USE_PRODUCTION = process.env.NODE_ENV == "production";
// above distinction is made automatically
// if below is true, then we shall use remote server BE, even though running app in development
const STAGE_PRODUCTION = true;
// now get on with the show...



function postData(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}



export const RX_LOGIN = function(userData) {
  return function(dispatch, getState) {

    // Request
    postData('http://localhost:1080/auth/login', userData)
    .then((response) => {
        // Success
        dispatch({
          type: "RX_LOGIN",
          data: response.data.user
        });

    })
    .catch((err)=> {
        // Error
        console.warn(err);
    })

  };
}
export const RX_LOGOUT = function(userData) {
  return function(dispatch, getState) {

    dispatch({
      type: "RX_LOGIN",
      data: {}
    });

  };
}
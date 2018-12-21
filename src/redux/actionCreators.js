// if (process.env.NODE_ENV == "development") { /* we use local FE & BE */ }
// if (process.env.NODE_ENV == "production") { /* we use remote server BE */ }
// const USE_PRODUCTION = process.env.NODE_ENV == "production";
// console.log('USE_PRODUCTION',USE_PRODUCTION);
// above distinction is made automatically
// if below is true, then we shall use remote server BE, even though running app in development
// const STAGE_PRODUCTION = true;
// console.log('STAGE_PRODUCTION',STAGE_PRODUCTION);
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




export const RX_ACCOUNT_LOGIN = function(userData) {
  return function(dispatch, getState) {

    // Request
    postData('http://localhost:1080/account/login', userData)
    .then((response) => {
      if (response.data) {
        // Success
        dispatch({
          type: "RX_ACCOUNT_LOGIN",
          data: response.data
        });
        dispatch(RX_TOAST("success", "Welcome back!"));
      } else {
        // Fail
        dispatch(RX_TOAST("fail", "login failed: " + response.error));
      }
    })
    .catch((err)=> {
      dispatch(RX_TOAST("error", "server error: " + err));
    })

  };
}
export const RX_ACCOUNT_REGISTER = function(userData) {
  return function(dispatch, getState) {

    // Request
    postData('http://localhost:1080/account/register', userData)
    .then((response) => {
      if (response.data) {
        // Success
        dispatch({
          type: "RX_ACCOUNT_LOGIN",
          data: response.data
        });
        dispatch(RX_TOAST("success", "Registration successful. Welcome!"));
      } else {
        // Fail
        dispatch(RX_TOAST("fail", "request failed: " + response.error));
      }
    })
    .catch((err)=> {
      dispatch(RX_TOAST("error", "server error: " + err));
    })

  };
}
export const RX_ACCOUNT_LOGOUT = function(userData) {
  return function(dispatch, getState) {
    dispatch({
      type: "RX_ACCOUNT_LOGIN",
      data: {}
    });
    dispatch(RX_TOAST("fail", "Bye"));
  };
}




export const RX_AGGREGATOR_ADD = function(userData) {
  return function(dispatch, getState) {
    const access_token = getState().account._access_token;

    // Request
    postData('http://localhost:1080/aggregator/add/'+access_token, userData)
    .then((response) => {
      if (response.data) {
        // Success
        dispatch({
          type: "RX_AGGREGATOR_ADD",
          data: response.data
        });
        dispatch(RX_TOAST("success", "Added new aggregator: "+response.data.title));
      } else {
        // Failed
        dispatch(RX_TOAST("fail", "request failed: " + response.error));
      }
    })
    .catch((err)=> {
      dispatch(RX_TOAST("error", "server error: " + err));
    })

  };
}

export const RX_AGGREGATOR_FIND = function(query) {
  return function(dispatch, getState) {
    const access_token = getState().account._access_token;

    // Request
    postData('http://localhost:1080/aggregator/find/'+access_token, query)
    .then((response) => {
      if (response.data) {
        // Success
        dispatch({
          type: "RX_AGGREGATOR_FIND",
          data: response.data
        });
      } else {
        // Failed
        dispatch(RX_TOAST("fail", "request failed: " + response.error));
      }
    })
    .catch((err)=> {
      dispatch(RX_TOAST("error", "server error: " + err));
    })

  };
}




export const RX_TOAST = function(intent, message) {
  // IF BOTH ARGUMENTS PROVIDED:
  if (intent && message) {
    // remap intent
    switch (intent) {
      case "error":
        intent = "danger";
      break;
      case "fail":
        intent = "warning";
      break;
      default:
        intent = "success";
      break;
    }
    // display second argument
    return {
      type: "RX_TOAST",
      intent: intent,
      message: message
    };
  }
  // OPTIONALLY, USE WITH ONLY ONE ARGUMENT:
  if (intent && !message) {
    // display first argument instead of second
    return {
      type: "RX_TOAST",
      intent: "",
      message: intent
    };
  }
}
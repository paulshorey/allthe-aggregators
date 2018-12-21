/*
  STATE:
*/
const oldState = {
  toast: ""
};
const ThisReducer = (state = oldState, action) => {
  var newState = window.deepCopy(state);

  /*
    HANDLE ACTION:
  */
  switch (action.type) {

    case "RX_TOAST":
      newState.toast = {
        intent: action.intent,
        message: action.message
      }
    break;

    default:
    break;

  }

  /*
    RETURN (COPY OF) STATE:
  */
  return newState;
};

export default ThisReducer;
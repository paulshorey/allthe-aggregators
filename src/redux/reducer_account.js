
/*
  STATE:
*/
const oldState = {
  loggedIn: false
};
const ThisReducer = (state = oldState, action) => {
  var newState = window.deepCopy(state);

  /*
    HANDLE ACTION:
  */
  switch (action.type) {

    case "RX_LOGIN":
      newState.loggedIn = true;
    break;

  }

  /*
    RETURN (COPY OF) STATE:
  */
  return newState;
};

export default ThisReducer;
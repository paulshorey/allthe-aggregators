
/*
  STATE:
*/
const oldState = {
  data: {}
};
const ThisReducer = (state = oldState, action) => {
  var newState = window.deepCopy(state);

  /*
    HANDLE ACTION:
  */
  switch (action.type) {

    case "RX_LOGIN":
      newState.data = action.data;
    break;

  }

  /*
    RETURN (COPY OF) STATE:
  */
  return newState;
};

export default ThisReducer;
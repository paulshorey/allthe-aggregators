const uiState = {
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
    case "WHATEVER":
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

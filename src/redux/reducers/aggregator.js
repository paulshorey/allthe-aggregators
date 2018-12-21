const oldState = {
  find: []
};
const ThisReducer = (state = oldState, action) => {
  var newState = window.deepCopy(state);

  /*
    HANDLE ACTION:
  */
  switch (action.type) {

    case "RX_AGGREGATOR_ADD":
      console.log('ADD',action.data);
      // newState.find.push(action.data);
    break;
    case "RX_AGGREGATOR_FIND":
      newState.find = action.data.results;
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
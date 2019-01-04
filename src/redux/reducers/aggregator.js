const oldState = {
  list: [],
  selected: {}
};
const ThisReducer = (state = oldState, action) => {
  var newState = window.deepCopy(state);

  /*
    HANDLE ACTION:
  */
  switch (action.type) {

    case "RX_AGGREGATOR_ADD":
      console.log('ADD',action.data);
      newState.list.push(action.data);
    break;
    case "RX_AGGREGATOR_FIND":
      newState.list = action.data;
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
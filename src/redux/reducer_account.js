/*
  PERSIST STATE:
*/
const loadState = ()=>{
  try {
    const serializedState = localStorage.getItem('rx_state_account');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch(err) {
    return undefined;
  }
}
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('rx_state_account', serializedState);
  } catch(err) {
    // Ignore write errors
  }
}

/*
  STATE:
*/
const oldState = loadState() || {
};
const ThisReducer = (state = oldState, action) => {
  var newState = window.deepCopy(state);

  /*
    HANDLE ACTION:
  */
  switch (action.type) {

    case "RX_LOGIN":
      newState = {...action.data};
    break;

  }

  /*
    RETURN (COPY OF) STATE:
  */
  saveState(newState);
  return newState;
};

export default ThisReducer;
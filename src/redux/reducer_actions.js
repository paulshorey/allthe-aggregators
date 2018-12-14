import * as actions from './actionCreators';

/*
  NOTE:
  This reducer does not modify the state. So, it is not really a reducer...
  It is simply a mechanism for getting Redux actions to each component that needs them. 
  Inside component, use like this:
  ...
  const mapStateToProps = function(state) {
    return {
      actions: state.actions
    }
  }
  ...
  onClick={()=>{ 
    this.props.dispatch(this.props.actions.whateverAction());
  }}
*/
const oldState = {
  ...actions
};
const ThisReducer = (state = oldState, action) => {
  console.log('ThisReducer state',state);
  return state;
};

export default ThisReducer;
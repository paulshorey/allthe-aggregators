import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class ThisComponent extends React.Component {
	constructor(props){
		super(props);
		props.dispatch(props.actions.RX_AGGREGATOR_FIND());
	}
  render() {
    var Aggs = [];
    for (let a in this.props.aggregator.find) {
      let agg = this.props.aggregator.find[a];
      Aggs.push(<li><label>{a}:</label> <b>{agg.title}</b></li>);
    }
    return (
      this.props.account._id
      ?
      <div>
        <p>Aggregators List</p>
        <ul>
          {Aggs}
        </ul>
      </div>
      :
      <Redirect to="/account" />
    )
  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account,
    actions: state.actions,
    aggregator: state.aggregator
  }
}
export default connect(mapStateToProps)(ThisComponent);
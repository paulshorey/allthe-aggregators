import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class ThisComponent extends React.Component {
	constructor(props){
		super(props);
		props.dispatch(props.actions.RX_CRAWLER_FIND());
	}
  render() {
    var Items = [];
    for (let a in this.props.crawler.find) {
      let agg = this.props.crawler.find[a];
      Items.push(<li><label>{a}:</label> <b>{agg.title}</b></li>);
    }
    return (
      this.props.account._id
      ?
      <div>
        <p>Crawlers List</p>
        <ul>
          {Items}
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
    crawler: state.crawler
  }
}
export default connect(mapStateToProps)(ThisComponent);
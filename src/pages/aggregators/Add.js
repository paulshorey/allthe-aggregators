import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ValidateForm, ValidateField, ValidateButton, validations } from 'src/containers/validateForm';
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";
import md5 from "md5";

class ThisComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      account_id: props.account._id
    }
  }
  handleSubmit = () => {
    this.props.dispatch(this.props.actions.RX_AGGREGATOR_ADD({ "title": this.state.title, "account_id": this.state.account_id }));  
  }
  render() {
    return (
      this.props.account._id
      ?
      <div>
        <p>Register</p>
        <ValidateForm
          onSubmit={this.handleSubmit}
        >

          <ValidateField
            name="title"
            value={this.state.title}
            validations={[validations.required]} 
          >
            <legend>Title:</legend>
            <InputGroup
              name="title"
              type="text"
              placeholder="title"
              onChange={(event)=>{ this.setState({ title: event.target.value }); }}
              value={this.state.title}
            />
          </ValidateField>


          <ValidateButton type="submit">
            <Button icon="tick" type="submit">
              Submit
            </Button>
          </ValidateButton>

          <ValidateButton 
            type="reset" 
            onClick={(initialValues)=>{
              this.setState(initialValues);
            }}
          >
            <Button icon="cross">
              Reset
            </Button>
          </ValidateButton>

        </ValidateForm>
      </div>
      :
      <Redirect to="/account" />
    )
  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account,
    actions: state.actions
  }
}
export default connect(mapStateToProps)(ThisComponent);
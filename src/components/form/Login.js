import React from "react";
import { connect } from 'react-redux';
import { ValidateForm, ValidateField, ValidateButton, validations } from 'src/containers/justValidate';


class LoginForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "ps@artspaces.net",
      password: "demo"
    }
  }
  render() {
    return (
      <ValidateForm>

        <ValidateField validate={this.state.email} validations={[validations.required, validations.email]} >
          <label className="green">
            Email:
          </label>
          <input
            name="email"
            type="text"
            placeholder="email"
            onChange={(event)=>{ this.setState({ email: event.target.value }); }}
          />
        </ValidateField>


        <ValidateField validate={this.state.email} validations={[validations.required, validations.email]} >
          <label className="green">
            Password:
          </label>
          <input
            context={this}
            name="password"
            type="password"
            placeholder="password"
            validations={[validations.required, validations.email]}
          />
        </ValidateField>

        <ValidateButton valid>
          <button onClick={()=>{ 
            this.props.dispatch(this.props.actions.RX_LOGIN({ "email": this.state.email, "password": window.MD5(this.state.password) }));
          }}>
            Submit
          </button>
        </ValidateButton>

        <ValidateButton changed>
          <button onClick={()=>{ 
            window.alert('reset');
          }}>
            Reset
          </button>
        </ValidateButton>

      </ValidateForm>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    account: state.account,
    actions: state.actions
  }
}
export default connect(mapStateToProps)(LoginForms);
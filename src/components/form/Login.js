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

        <ValidateField
          name="email"
          value={this.state.email}
          validations={[validations.required, validations.email]} 
        >
          <legend>Email:</legend>
          <label className="green">
            Email:
          </label>
          <input
            name="email"
            type="text"
            placeholder="email"
            onChange={(event)=>{ this.setState({ email: event.target.value }); }}
            value={this.state.email}
          />
        </ValidateField>


        {/* <ValidateField value={this.state.password} validations={[validations.required, validations.email]} > */}
        {/*   <label className="green"> */}
        {/*     Password: */}
        {/*   </label> */}
        {/*   <input */}
        {/*     context={this} */}
        {/*     name="password" */}
        {/*     type="password" */}
        {/*     placeholder="password" */}
        {/*     onChange={(event)=>{ this.setState({ password: event.target.value }); }} */}
        {/*   /> */}
        {/* </ValidateField> */}


        <ValidateButton if="valid">
          <button onClick={()=>{ 
            this.props.dispatch(this.props.actions.RX_LOGIN({ "email": this.state.email, "password": window.MD5(this.state.password) }));
          }}>
            Submit
          </button>
        </ValidateButton>

        <ValidateButton if="changed">
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
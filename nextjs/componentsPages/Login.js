import React from "react";

/*
  Connect Redux (global state)
*/
import { Provider } from "react-redux";
import redux_store from "../redux/store";


/*
  Components / Libraries / Dependencies
*/
import FormLogin from '../components/forms/Login';
import FormRegister from '../components/forms/Register';
import { Input } from 'antd';
const Search = Input.Search;


/*
  DOM
*/
export default class extends React.Component {
  render() {
    return (
      <Provider store={redux_store}>
        <React.Fragment>
          <Search
            placeholder="Enter UID token"
            enterButton="Submit"
            size="large"
            onSearch={value => console.log(value)}
          />
          <FormLogin />
          {/* <FormRegister /> */}
        </React.Fragment>
      </Provider>
    );
  }
}

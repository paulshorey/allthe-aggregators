import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";


const Header = withRouter(
  ({ history }) =>
    <p>
      Welcome!
      <button
        onClick={() => {
          history.push("/");
        }}
      >
        Sign out
      </button>
    </p>
);

function RouteHome() {
  return <h3>Home</h3>;
}

class RouteLogin extends React.Component {
  state = { redirectToReferrer: false };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };

    let { redirectToReferrer } = this.state;
    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <input type="text" value="" placeholder="Your account UID..." />
        {/* <button onClick={this.login}>Log in</button> */}
      </div>
    );
  }
}

function AuthExample() {
  return (
    <Router>
      <div>
        <Header />
        <ul>
          <li>
            <Link to="/">Home Page</Link>
          </li>
          <li>
            <Link to="/login">Login Page</Link>
          </li>
        </ul>
        <Route path="/" exact component={RouteHome} />
        <Route path="/login" exact component={RouteLogin} />
      </div>
    </Router>
  );
}

export default AuthExample;
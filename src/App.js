import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import RouteAccount from './routes/Account';
import RouteAuth from './routes/Auth';

/*
  Components
*/
class NotFound extends Component {
  render() {
    return (
      <div>
        <p>NotFound route...</p>
      </div>
    )
  }
}
class Home extends Component {
  render() {
    return (
      <div>
        <p>Home route...</p>
      </div>
    )
  }
}
class Topic extends Component {
  render() {
    // console.log('Topic',this.props);
    return (
      <div>
        <p>What?</p>
        <p>
          {this.props.match.params.topicId}
        </p>
      </div>
    )
  }
}
class About extends Component {
  render() {
    return (
      <div>
        <p>About route...</p>
        <Route path={`/about/:topicId`} component={Topic}/>
      </div>
    )
  }
}
class Aggregators extends Component {
  render() {
    console.log('this.props',this.props);
    return (
      <div>
        <p>Aggregators dashboard...</p>
        <p>{this.props.match.params.action}</p>
      </div>
    )
  }
}
class Crawlers extends Component {
  render() {
    return (
      <div>
        <p>Crawlers dashboard...</p>
        <p>{this.props.match.params.action}</p>
      </div>
    )
  }
}
class Results extends Component {
  render() {
    console.log('this.props',this.props);
    return (
      <div>
        <p>Results dashboard...</p>
        <p>{this.props.match.params.action}</p>
      </div>
    )
  }
}

/*
	App
*/
export default class App extends Component {
  componentDidMount(){
    document.body.classList.add('mapLoading');
  }
  render() {
    return (
      <Router>
          <div className="dash">
            <div className="dash-sidenav">
              
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link to="/account">My Account</Link>
                  <ul>
                    <li>
                      <Link to="/account/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/account/logout">Logout</Link>
                    </li>
                    <li>
                      <Link to="/account/register">Register</Link>
                    </li>
                    <li>
                      <Link to="/account/password">Change Password</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              
              <ul>
                <li>
                  <Link to="/about">About</Link>
                  <ul>
                    <li>
                      <Link to="/about/one">:one</Link>
                    </li>
                    <li>
                      <Link to="/about/two">:two</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              
              <ul>
                <li>
                  <Link to="/aggregators">Aggregators</Link>
                  <ul>
                    <li>
                      <Link to="/aggregators/list">:list</Link>
                    </li>
                    <li>
                      <Link to="/aggregators/add">:add</Link>
                    </li>
                    <li>
                      <Link to="/aggregators/edit">:edit</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              
              <ul>
                <li>
                  <Link to="/crawlers">Crawlers</Link>
                  <ul>
                    <li>
                      <Link to="/crawlers/list">:list</Link>
                    </li>
                    <li>
                      <Link to="/crawlers/add">:add</Link>
                    </li>
                    <li>
                      <Link to="/crawlers/edit">:edit</Link>
                    </li>
                  </ul>
                </li>
              </ul>
              
              <ul>
                <li>
                  <Link to="/results">Results</Link>
                  <ul>
                    <li>
                      <Link to="/results/list">:list</Link>
                    </li>
                    <li>
                      <Link to="/results/add">:add</Link>
                    </li>
                    <li>
                      <Link to="/results/edit">:edit</Link>
                    </li>
                  </ul>
                </li>
              </ul>

            </div>
            <div className="dash-content">
              <Switch>
                <Route path="/about" component={About} />
                <Route path="/aggregators/:action?/:uid?" component={Aggregators} />
                <Route path="/crawlers/:action?/:uid?" component={Crawlers} />
                <Route path="/results/:action?/:uid?" component={Results} />
                <Route path="/account" component={RouteAccount} />
                <Route path="/auth" component={RouteAuth} />
                <Route path="/" exact component={Home} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
      </Router>
    );
  }
}
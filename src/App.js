/*
  Components
*/
class LoginLogout extends Component {
  render() {
    return (
      <div>
        <p>Login/Logout route...</p>
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
class App extends Component {
  componentDidMount(){
    document.body.classList.add('mapLoading');
  }
  render() {
    return (
      <Router>
        <Provider store={redux_store}>
          <div className="dash">
            <div className="dash-sidenav">
              
              <ul>
                <li>
                  <Link to="/">Login/Logout</Link>
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
              <Route path="/about" component={About} />
              <Route path="/aggregators/:action/:uid?" component={Aggregators} />
              <Route path="/crawlers/:action/:uid?" component={Crawlers} />
              <Route path="/results/:action/:uid?" component={Results} />
              <Route path="/login" component={LoginLogout} />
              <Route path="/logout" component={LoginLogout} />
              <Route path="/" exact component={LoginLogout} />
              <Route component={LoginLogout} />
            </div>
          </div>
        </Provider>
      </Router>
    );
  }
}
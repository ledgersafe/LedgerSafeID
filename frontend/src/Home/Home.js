import React, { Component } from 'react';
import Profile from '../Profile/Profile';

class Home extends Component {
  login() {
    this.props.auth.login();
  }
  render() {
    console.log(this.props.history)
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
              <Profile auth={this.props.auth}/>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please{' '}
                <a style={{ cursor: 'pointer' }} onClick={() => {this.props.history.replace('/login')}}>
                  Log In
                </a>
                {' '}to continue or {' '}
                <a style={{ cursor: 'pointer' }} onClick={() => {this.props.history.replace('/signup')}}>
                  Sign Up
                </a>{''}.
              </h4>
            )
        }
      </div>
    );
  }
}

export default Home;

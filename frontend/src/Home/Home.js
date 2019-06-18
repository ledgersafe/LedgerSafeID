import React, { Component } from 'react';
import Profile from '../Profile/Profile';
import LoginForm from '../Login/LoginForm'
import SignUpForm from '../SignUp/SignUpForm'

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      is_login_and_not_signup: true
    }

    this.changeForm = this.changeForm.bind(this)
  }

  changeForm(){
    this.setState({ is_login_and_not_signup: !this.state.is_login_and_not_signup })
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    let form = this.state.is_login_and_not_signup ? <LoginForm auth={this.props.auth} change={this.changeForm}/> : <SignUpForm auth={this.props.auth} change={this.changeForm}/>
    return (
      <div className="container">
        {
          isAuthenticated() && (
              <Profile auth={this.props.auth}/>
            )
        }
        {
          !isAuthenticated() && (
              // <h4>
              //   You are not logged in! Please{' '}
              //   <a style={{ cursor: 'pointer' }} onClick={() => {this.props.history.replace('/login')}}>
              //     Log In
              //   </a>
              //   {' '}to continue or {' '}
              //   <a style={{ cursor: 'pointer' }} onClick={() => {this.props.history.replace('/signup')}}>
              //     Sign Up
              //   </a>{''}.
              // </h4>
              form
            )
        }
      </div>
    );
  }
}

export default Home;

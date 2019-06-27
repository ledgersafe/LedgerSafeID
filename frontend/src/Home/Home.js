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

  /**
   * Changes between login form and sign up form on main page by setting state
   *
   * @public
   */
  changeForm(){
    this.setState({ is_login_and_not_signup: !this.state.is_login_and_not_signup })
  }

  /**
   * Displays the Home Component.
   *
   * @public
   */
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
              form
            )
        }
      </div>
    );
  }
}

export default Home;

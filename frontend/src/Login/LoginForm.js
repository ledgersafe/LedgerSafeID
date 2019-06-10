import React, { Component } from 'react';
import $ from 'jquery';
import './LoginForm.css'
import { Button } from 'react-bootstrap';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.username = "";
    this.password = "";
    this.login_error = false;
    this.missing_info = false;
    this.state = {
      login_success: "",
    };

    this.onChange = this.onChange.bind(this);
    this.handleUserLoginChange = this.handleUserLoginChange.bind(this);
    this.handlePasswordLoginChange = this.handlePasswordLoginChange.bind(this);
    this.callLogin = this.callLogin.bind(this);
  }
  
  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  componentDidMount() {
    const { renewSession } = this.props.auth;

    if (localStorage.getItem('loggedIn') === 'true') {
      renewSession();
    }
  }

  auth_login() {
    this.props.auth.login();
  }

  auth_logout() {
    this.props.auth.logout();
  }

  handleUserLoginChange = event => {
    event.preventDefault()
    this.username = event.target.value;
  }

  handlePasswordLoginChange = event => {
    event.preventDefault()
    this.password = event.target.value;
  }

  callLogin() {
    if (this.password && this.username) {
      this.missing_info = false;
      $.ajax({
        url: 'http://localhost:4000/login',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        crossDomain: true,
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {
          username: this.username,
          password: this.password
        },
        success: (data) => {
          if (data.message === "OK") {
            console.log('success');
            this.login_error = false;
            this.setState({ login_success: true });
            this.auth_login()
          } else {
            this.login_error = true;
            this.setState({ login_success: false });
            console.log('failure');
          }
        }
      });
    } else {
      this.missing_info = true;
      this.setState({ login_success: false });
    }
  }

  render() {
    console.log("rendering")
    return (
      <div className="interface">
        <div className="loginForm">
          <input type="text" className="loginFormField" placeholder="Username" onChange={this.handleUserLoginChange} />
          <br></br>
          <input type="password" className="loginFormField" placeholder="Password" onChange={this.handlePasswordLoginChange} />
          {this.login_error && !this.missing_info ?
            <div className="error_msg">Either your username or password is incorrect.</div>
            : null
          }
          {this.missing_info ?
            <div className="error_msg">Please complete empty fields.</div>
            : null
          }
          <div>
            <input type="submit" className="loginButton" value="Login" onClick={this.callLogin}></input>
          </div>
        </div>
        <div className="registerDiv">
          <Button onClick={this.props.history.replace('/signup')}>Don't have an account? Sign Up</Button>
        </div>
      </div>
    );
  }
}

export default LoginForm;
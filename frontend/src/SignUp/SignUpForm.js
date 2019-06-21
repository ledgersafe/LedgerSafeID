import React, { Component } from 'react';
import $ from 'jquery';
import './SignUpForm.css'
import { Button } from 'react-bootstrap';

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.username = "";
    this.password = "";
    this.name = "";
    this.role = "bus";
    this.license = "";
    this.email = "";
    this.address = "";

    this.registration_errmsg = "";
    this.username_err = false;
    this.password_err = false;
    this.name_err = false;
    this.license_err = false;
    this.email_err = false;
    this.address_err = false;
    this.invalid_password = false;
    this.state = {
      regis_success: false
    };

    this.onChange = this.onChange.bind(this); 
    this.handleUserRegisChange = this.handleUserRegisChange.bind(this);
    this.handlePasswordRegisChange = this.handlePasswordRegisChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLicenseChange = this.handleLicenseChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.callRegister = this.callRegister.bind(this);
    this.auth_signup = this.auth_signup.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  checkPassword(pw){
    let check_count = 0;
    var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    if(pw.toUpperCase() !== pw) check_count++;
    if(pw.toLowerCase() !== pw) check_count++;
    if(/\d/.test(pw)) check_count++;
    if(regex.test(pw)) check_count++;
    return (pw.length > 7) && (check_count >= 3)
  }

  handleUserRegisChange = event => {
    event.preventDefault()
    this.username = event.target.value;
  }

  handlePasswordRegisChange = event => {
    event.preventDefault()
    this.password = event.target.value;
  }

  handleNameChange = event => {
    event.preventDefault()
    this.name = event.target.value;
  }

  handleEmailChange = event => {
    event.preventDefault()
    this.email = event.target.value;
  }

  handleLicenseChange = event => {
    event.preventDefault()
    this.license = event.target.value;
  }

  handleRoleChange = event => {
    event.preventDefault()
    this.role = document.getElementById("role").value;
  }

  handleAddressChange = event => {
    event.preventDefault()
    this.address = event.target.value;
  }

  validateEmail(email) {
    if (!email) {
      return true;
    }
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  callRegister() {
    let passed_auth0 = this.auth_signup(this.username, this.email, this.password);
    if(passed_auth0){
    !this.username ? this.username_err = true : this.username_err = false;
    !this.name ? this.name_err = true : this.name_err = false;
    !this.password ? this.password_err = true : this.password_err = false;
    !this.address ? this.address_err = true : this.address_err = false;
    !this.license ? this.license_err = true : this.license_err = false;
    !this.email || !this.validateEmail(this.email) ? this.email_err = true : this.email_err = false;
    !this.checkPassword(this.password) ? this.invalid_password = true : this.invalid_password = false;
    if (!this.username_err && !this.name_err
      && !this.password_err && !this.license_err
      && !this.address_err && !this.email_err && !this.invalid_password) {
      $.ajax({
        url: 'http://localhost:4000/register',
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
            this.registration_errmsg = "";
            console.log('success');
            this.setState({ regis_success: true });
          } else {
            this.registration_errmsg = data.result;
            console.log(this.registration_errmsg);
            this.setState({ regis_success: false });
            console.log('failure');
          }
        }
      });
    }
    else {
      console.log("failed to call register, "+this.state.regis_success)
      this.setState({ regis_success: false });
    }
  }
}

  auth_signup(un, em, pw, nam, add, lic, role){
    console.log('signup called')
    this.props.auth.auth0_signup(un, em, pw);
  }

  render() {
    return (
      <div className="interface">
        {/* {this.redirectAfterRegister()} */}
        <div className="registerUserForm">
            <input type="text" className="regFormField" placeholder="Username" onChange={this.handleUserRegisChange} />
            {this.registration_errmsg === "user duplicate" ?
              <div className="error_msg">Someone is already using this username.</div>
              : null
            }
            {this.username_err ?
              <div className="error_msg">Fill in your username.</div>
              : null
            }
            {this.username_err || this.registration_errmsg === "user duplicate" ? null : <br></br>}
            <input type="password" className="regFormField" placeholder="Password" onChange={this.handlePasswordRegisChange} />
            {this.password_err ?
              <div className="error_msg">Fill in your password.</div>
              : <br></br>
            }
            {
              this.invalid_password ? 
              <div className="error_msg">Password must be at least 8 characters in length and contain at least 3 of the following 4 types of characters: lower case letters (a-z), upper case letters (A-Z), numbers (i.e. 0-9), special characters (e.g. !@#$%^&*)</div>
              : null
            }
            <input type="text" className="regFormField" placeholder="Name" onChange={this.handleNameChange} />
            {this.name_err ?
              <div className="error_msg">Fill in your name.</div>
              : <br></br>
            }
            <input type="email" className="regFormField" placeholder="Email" onChange={this.handleEmailChange} />
            {this.email_err ?
              <div className="error_msg">Enter a valid email address.</div>
              : <br></br>
            }
            <input type="text" className="regFormField" placeholder="Address" onChange={this.handleAddressChange} />
            {this.address_err ?
              <div className="error_msg">Fill in your address.</div>
              : <br></br>
            }
            <div>
              <input type="text" className="regFormField" placeholder="License" onChange={this.handleLicenseChange} />
              {this.license_err ?
                <div className="error_msg">Fill in your license.</div>
                : <br></br>
              }
              <select className="regFormField" id="role" onChange={this.handleRoleChange}>
                <option value="bus">Business</option>
                <option value="fin">Financial Institution</option>
                <option value="reg">Regulator</option>
              </select>
            </div>
            <div>
            {this.registration_errmsg === "admin null" ?
              <div className="error_msg">There is no admin node available.</div>
              : null
            }
          {/* <div id='error-message' style={{color: "#cc342c"}}></div> */}
              <input type="submit" className="submitButton" value="Register" onClick={this.callRegister}></input>
            </div>
        </div>
        <div className="loginDiv">
        {/* <Button onClick={() => {this.props.history.replace('/login')}}>Have an account already? Log In</Button> */}
        <Button onClick={() => {this.props.change()}}>Have an account already? Log In</Button>
        </div>
        {/* <div className="enrollAdminForm">
          <input type="text" className="adFormField" placeholder="Admin ID" onChange={this.handleAdminIdChange} />
          <input type="password" className="adFormField" placeholder="Admin Password" onChange={this.handleAdminPwChange} />
          <input type="submit" value="Enroll" onClick={this.callEnrollAdmin}></input>
        </div> */}
      </div>
    );
  }
}

export default SignUpForm;
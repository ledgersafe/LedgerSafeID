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
    this.state = {
      regis_success: false
    };

    this.onChange = this.onChange.bind(this);
    // this.handleUserLoginChange = this.handleUserLoginChange.bind(this);
    // this.handlePasswordLoginChange = this.handlePasswordLoginChange.bind(this);    
    this.handleUserRegisChange = this.handleUserRegisChange.bind(this);
    this.handlePasswordRegisChange = this.handlePasswordRegisChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleLicenseChange = this.handleLicenseChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.redirectAfterRegister = this.redirectAfterRegister.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    // this.handleAdminIdChange = this.handleAdminIdChange.bind(this);
    // this.handleAdminPwChange = this.handleAdminPwChange.bind(this);
    // this.callLogin = this.callLogin.bind(this);
    // this.callEnrollAdmin = this.callEnrollAdmin.bind(this);
    this.callRegister = this.callRegister.bind(this);
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  //   handleUserLoginChange = event => {
  //     event.preventDefault()
  //     this.setState({ login_username: event.target.value });
  //   }

  //   handlePasswordLoginChange = event => {
  //     event.preventDefault()
  //     this.setState({ login_password: event.target.value });
  //   }

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

  //   handleAdminIdChange = event => {
  //     event.preventDefault()
  //     this.setState({ admin_id: event.target.value });
  //   }

  //   handleAdminPwChange = event => {
  //     event.preventDefault()
  //     this.setState({ admin_pw: event.target.value });
  //   }

  //   callLogin() {
  //     if (this.state.login_password && this.state.login_username) {
  //       const loginData = {
  //         username: this.state.login_username,
  //         password: this.state.login_password
  //       }
  //       $.ajax({
  //         url: 'http://localhost:4000/login',
  //         type: 'POST',
  //         contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  //         crossDomain: true,
  //         dataType: 'json',
  //         xhrFields: { withCredentials: true },
  //         data: {
  //           username: this.state.login_username,
  //           password: this.state.login_password
  //         },
  //         success: (data) => {
  //           if (data.message === "OK") {
  //             this.setState({ login_success: true });
  //             console.log('success');
  //           } else {
  //             this.setState({ login_success: false });
  //             console.log('failure');
  //           }
  //         }
  //       });
  //     } else {
  //       alert("Please fill in login form fields.")
  //     }
  //   }

  validateEmail(email) {
    if (!email) {
      return true;
    }
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  callRegister() {
    !this.username ? this.username_err = true : this.username_err = false;
    !this.name ? this.name_err = true : this.name_err = false;
    !this.password ? this.password_err = true : this.password_err = false;
    !this.address ? this.address_err = true : this.address_err = false;
    !this.license ? this.license_err = true : this.license_err = false;
    !this.email || !this.validateEmail(this.email) ? this.email_err = true : this.email_err = false;
    if (!this.username_err && !this.name_err
      && !this.password_err && !this.license_err
      && !this.address_err && !this.email_err) {
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
            this.props.history.replace('/signup');
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

  //   callEnrollAdmin() {
  //     if (this.state.admin_id && this.state.admin_pw) {
  //       const adminData = {
  //         id: this.state.admin_id,
  //         pw: this.state.admin_pw
  //       }
  //       console.log(JSON.stringify(adminData))
  //       $.ajax({
  //         url: 'http://localhost:4000/enroll',
  //         context: document.body,
  //         type: 'POST',
  //         contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  //         crossDomain: true,
  //         dataType: 'json',
  //         xhrFields: { withCredentials: true },
  //         data: {
  //           id: this.state.admin_id,
  //           pw: this.state.admin_pw
  //         },
  //         success: (data) => {
  //           if (data.message === "OK") {
  //             this.setState({ enroll_success: true });
  //             console.log('success');
  //           } else {
  //             this.setState({ enroll_success: false });
  //             console.log('failure');
  //           }
  //         }
  //       });
  //     }
  //     else {
  //       alert("Please fill in admin form fields.")
  //     }
  //   }

  render() {
    return (
      <div className="interface">
        {this.redirectAfterRegister()}
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
              <input type="submit" className="submitButton" value="Register" onClick={this.callRegister}></input>
            </div>
        </div>
        <div className="loginDiv">
        <Button onClick={this.props.history.replace('/home')}>Don't have an account? Sign Up</Button>
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
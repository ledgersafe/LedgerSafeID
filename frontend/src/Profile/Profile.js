import React, { Component } from 'react';
import { Panel, ControlLabel, Glyphicon } from 'react-bootstrap';
import './Profile.css';
import $ from 'jquery';

class Profile extends Component {

  componentWillMount() {
    console.log("componentMounts")
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  callRegister(user) {
    $.ajax({
      url: 'http://localhost:4000/register',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: {
        username: user,
      },
      success: (data) => {
        if (data.message === "OK") {
          this.registration_errmsg = "";
          console.log('regis success');
        } else {
          this.registration_errmsg = data.result;
          console.log(this.registration_errmsg);
          console.log('regis failure');
        }
      }
    });
  }
  callLogin(user) {
    $.ajax({
      url: 'http://localhost:4000/login',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: {
        username: user,
      },
      success: (data) => {
        if (data.message === "OK") {
          console.log('login success');
        } else {
          console.log('login failure '+user);
          this.callRegister(user);
        }
      }
    });
  }
  render() {
    const { profile } = this.state;
    console.log(profile)
    if(profile.nickname){
      this.callLogin(profile.nickname);
    }
    return (
      <div className="container">
        <div className="profile-area">
          <h1>{profile.name}</h1>
          <Panel header="Profile">
            <img src={profile.picture} alt="profile" />
            <div>
              <ControlLabel><Glyphicon glyph="user" /> Nickname</ControlLabel>
              <h3>{profile.nickname}</h3>
            </div>
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </Panel>
        </div>
      </div>
    );
  }
}

export default Profile;

import history from '../history';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  constructor() {
    this.auth0_signup = this.auth0_signup.bind(this);
    this.auth0_login = this.auth0_login.bind(this);
    this.auth0_logout = this.auth0_logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }


   /**
   * Registers a user in auth0.
   *
   * @param {string} un -- username of the proposed user
   * @param {string} em -- email of the proposed user
   * @param {string} pw -- password of the proposed user
   * @public
   */
  auth0_signup(un, em, pw){
    this.auth0.redirect.signupAndLogin({
      connection: AUTH_CONFIG.connection,
      username: un,
      email: em,
      password: pw
    }, function(err) {
      if (err){
        console.log(err);
        // var errorMessage = document.getElementById('error-message');
        // errorMessage.innerHTML = err.description;
        // errorMessage.style.display = 'block';
        return false; 
      }
      else{
        return true;
      }
    });
  }

   /**
   * Log in for a user in auth0.
   *
   * @param {string} un -- username of the proposed user
   * @param {string} em -- email of the proposed user
   * @param {string} pw -- password of the proposed user
   * @public
   */
  auth0_login(un, em, pw) {
    // this.auth0.authorize();
    this.auth0.login({
      realm: AUTH_CONFIG.connection,
      username: un,
      email: em,
      password: pw
    }, function(err) {
      if (err){
        console.log(err);
        var errorMessage = document.getElementById('error-message');
        errorMessage.innerHTML = 'Either your username, email or password is incorrect.';
        errorMessage.style.display = 'block';      }
    });
  }

   /**
   * Begins the authentication process.
   *
   * @public
   */
  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

   /**
   * Gets current session's access token.
   *
   * @public
   */
  getAccessToken() {
    return this.accessToken;
  }
   /**
   * Gets current session's identification token.
   *
   * @public
   */
  getIdToken() {
    return this.idToken;
  }

   /**
   * Sets information for a session.
   * @param {json} authResult -- Result of the auth0 authentication protocol
   *
   * @public
   */
  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    history.replace('/home');
  }

  /**
   * Retrieves user profile and information
   * @param {function} cb -- callback function
   * @public
   */
  getProfile(cb) {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  /**
   * Gets new token for user to stay authenticated
   *
   * @public
   */
  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.auth0_logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  /**
   * Removes user from session and deactivates authentication
   *
   * @public
   */
  auth0_logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.userProfile = null;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      returnTo: window.location.origin,
      client_id: AUTH_CONFIG.clientId
    });

    // navigate to the home route
    history.replace('/home');
  }

  /**
   * Checks if user is authenticated
   *
   * @public
   */
  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

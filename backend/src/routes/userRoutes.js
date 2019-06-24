const express = require('express');
const db = require('./db');
const { validateEmail, MD5 } = require('../validation.js');

const userRouter = express.Router();

module.exports = function router() {
  userRouter.route('/register')
    .post((req, res) => {
      const {
        username, password, email, license, address, role,
      } = req.body;
      if (password === '') {
        res.status(401).json({ message: 'NOK', result: 'No password entered' });
      }
      else if (!validateEmail(email)) {
        res.status(401).json({ message: 'NOK', result: 'Invalid email' });
      } else {
        db.query('SELECT u_user FROM users WHERE u_user=?', [username], (err, results) => {
          if (err) {
            res.status(500).json({ message: 'NOK', result: 'Server error: '+err });
          }
          if (results.length === 0) {
            db.query('INSERT INTO user_table (u_user, u_password, u_email, u_license, u_address, u_role) VALUES (?, ?, ?, ?, ?, ?)',
              [username, MD5(username + password), email, license, address, role],
              (err2) => {
                if (err2) {
                  res.status(500).json({ message: 'NOK', result: 'Server error: '+err2 });
                }
                res.status(201).send({ message : 'OK' });
              });
          } else {
            res.status(401).json({ message: 'NOK', result: 'Username already exists' });
          }
        });
      }
    });
  return userRouter;
};
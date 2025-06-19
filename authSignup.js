// authSignup.js
const express = require('express');
const passport = require('passport');
const { saveUserDomain } = require('./saveDomain');

module.exports = function (app) {
  // Trigger Google Sign-In
  app.get('/auth/signup/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Callback after successful auth
  app.get('/auth/signup/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const user = req.user;
      const email = user?.emails?.[0]?.value;
      const name = user?.displayName || 'user';

      if (!email) {
        console.error('Google auth failed: missing email.');
        return res.redirect('/');
      }

      // Create default subdomain
      const cleanName = name.replace(/\s+/g, '').toLowerCase();
      const subdomain = `${cleanName}.pacmacmobile.com`;

      // Save it
      saveUserDomain(email, 'subdomain', subdomain);

      // For now: wait for affiliate approval
      return res.redirect('/pending-affiliate.html');

      // Future upgrade:
      // return res.redirect(`https://youraffiliate.com/register?domain=${cleanName}.com&ref=AFF_ID`);
    }
  );
};

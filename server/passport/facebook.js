const jwt = require('jsonwebtoken')
const User = require('../../data/schema').User
const FacebookStrategy = require('passport-facebook').Strategy
const config = require('../.config')
/**
 * Return the Passport Local Strategy object.
 */
module.exports = new FacebookStrategy({
    clientID: '1918459001773315',
    clientSecret: '361e1b8b94fd9bc7a711f09db49b68b1',
    callbackURL: 'https://doblame.com/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
      console.log('FoC user', profile)
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        const payload = {
            sub: user._id
        }
        // create a token string
        const token = jwt.sign(payload, config.jwtSecret)

        return done(err, token, user)
    });
  }
);
'use strict';

const passport = require('passport');

exports.userinfo = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {

    res.json({
      user_id: req.user.id,
      username: req.user.username,
      address: req.user.address,
      scope: req.authInfo.scope
    });
  },
];

'use strict';

const passport = require('passport');

exports.userinfo = [
  passport.authenticate('bearer', { session: false }),
  (req, res) => {

    res.json({
      user_id: req.user.id,
      email: req.user.email,
      // password: req.user.password,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      address: req.user.address,
      city: req.user.city,
      postalCode: req.user.postalCode,
      province: req.user.province,
      role: req.user.role,
      picture: req.user.picture
    });

  },
];

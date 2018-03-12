'use strict';

const passport = require('passport');
const login = require('connect-ensure-login');


exports.index = (req, res) => {
    res.render('index');
};

exports.loginForm = (req, res) => {
    res.render('login');
};

exports.login = [
    passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }),
];

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};


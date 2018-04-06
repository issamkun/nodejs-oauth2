/**
 * Schema for the Users.
 */
'use strict';

var bcrypt = require('bcrypt')
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

const roles = ['user', 'admin']

const userSchema = new Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstname: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  province: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  services: {
    facebook: String,
    google: String
  },
  role: {
    type: String,
    enum: roles,
    default: 'user'
  },
  picture: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

var connectionUser = mongoose.createConnection('mongodb://admin:admin@ds215019.mlab.com:15019/express-server');
module.exports = connectionUser.model('User', userSchema);
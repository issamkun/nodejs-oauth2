// This code was inspired from the following sources
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js
// https://github.com/gerges-beshay/oauth2orize-examples
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/21963136#21963136
// https://stackoverflow.com/questions/23327010/how-to-generate-unique-id-with-node-js

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uidgen (length) {
    var buffer = []
      , chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      , charLength = chars.length;
  
    for (var i = 0; i < length; ++i) {

        buffer.push(chars[getRandomInteger(0, charLength - 1)]);
    
    }

    return buffer.join('');
  };
  
  module.exports = uidgen;
// Some of this code was inspired from the following sources (official doc for oauth2orize)
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js

'use strict';

const bcrypt = require('bcrypt')
const validate = Object.create(null);


validate.logAndThrow = (msg) => {
    throw new Error(msg);
};


validate.user = (user, password) => {
    validate.userExists(user);

    if ( !bcrypt.compareSync(password, user.password)){
    // if (user.password !== password) {
        console.log('User password is invalid');
        validate.logAndThrow('User password is invalid');
    }
    return user;
};

validate.userExists = (user) => {
    if (user == null) {
        console.log('User does not exist');
        validate.logAndThrow('User does not exist');
    }
    return user;
};

validate.client = (client, clientSecret) => {
    validate.clientExists(client);
    if (client.client_secret !== clientSecret) {
        validate.logAndThrow('Client secret is invalid');
    }
    return client;
};

validate.clientExists = (client) => {
    if (client == null) {
        validate.logAndThrow('Client does not exist');
    }
    return client;
};


module.exports = validate;
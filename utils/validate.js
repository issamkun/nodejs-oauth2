// Some of this code was inspired from the following sources (official doc for oauth2orize)
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js

'use strict';

const validate = Object.create(null);


validate.logAndThrow = (msg) => {
    throw new Error(msg);
};


validate.user = (user, password) => {
    validate.userExists(user);
    if (user.password !== password) {
        validate.logAndThrow('User password is invalid');
        console.log('User password is invalid');
        
    }
    return user;
};

validate.userExists = (user) => {
    if (user == null) {
        validate.logAndThrow('User does not exist');
        console.log('User does not exist');
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
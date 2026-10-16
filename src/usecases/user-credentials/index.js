const Joi = require('joi');
const { usersCredentialsDb } = require('../../database/queries');
const { hashPassword } = require('../../scripts/helper-functions');

const makeCreateUserCredentials = require('./create-user-credentials');
const createUserCredentials = makeCreateUserCredentials({
    Joi,
    usersCredentialsDb,
    hashPassword,
});

module.exports = {
    createUserCredentials,
}
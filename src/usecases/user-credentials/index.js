const Joi = require('joi');
const { usersCredentialsDb, authSessionsDb } = require('../../database/queries');

const { userService } = require('../../internal-apis');

const { hashPassword, verifyPassword, hashRefreshToken } = require('../../scripts/helper-functions');

const { generateAccessToken } = require("../../utils/generate-jwt-accesstoken");
const { generateRefreshToken } = require("../../utils/generate-refresh-token");

const makeCreateUserCredentials = require('./create-user-credentials');
const createUserCredentials = makeCreateUserCredentials({
    Joi,
    usersCredentialsDb,
    hashPassword,
});

const makeUserLogin = require('./user-login');
const userLogin = makeUserLogin({
    Joi,
    userService,
    hashPassword,
    verifyPassword,
    usersCredentialsDb,
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    authSessionsDb,
});

module.exports = {
    createUserCredentials,
    userLogin,
}
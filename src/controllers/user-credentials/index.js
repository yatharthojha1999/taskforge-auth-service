const usersCredentialsUsecase = require('../../usecases/user-credentials');

const makeCreateUserAction = require('./create-user-credentials');
const createUserCredentialsAction = makeCreateUserAction({
    createUserCredentialsUsecase: usersCredentialsUsecase.createUserCredentials,
});

const makeUserLoginAction = require('./user-login');
const userLoginAction = makeUserLoginAction({
    userLoginUsecase: usersCredentialsUsecase.userLogin,
});

const makeRotateRefreshTokenAction = require('./rotate-refresh-token');
const rotateRefreshTokenAction = makeRotateRefreshTokenAction({
    logoutUsecase: usersCredentialsUsecase.logout,
});

const makeLogoutAction = require('./logout');
const logoutAction = makeLogoutAction({
    logoutUsecase: usersCredentialsUsecase.logout,
});

module.exports = Object.freeze({
    createUserCredentialsAction,
    userLoginAction,
    rotateRefreshTokenAction,
    logoutAction,
});
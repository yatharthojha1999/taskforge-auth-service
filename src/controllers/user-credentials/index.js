const usersCredentialsUsecase = require('../../usecases/user-credentials');

const makeCreateUserAction = require('./create-user-credentials');
const createUserCredentialsAction = makeCreateUserAction({
    createUserCredentialsUsecase: usersCredentialsUsecase.createUserCredentials,
});

const makeUserLoginAction = require('./user-login');
const userLoginAction = makeUserLoginAction({
    userLoginUsecase: usersCredentialsUsecase.userLogin,
});

module.exports = Object.freeze({
    createUserCredentialsAction,
    userLoginAction,
});
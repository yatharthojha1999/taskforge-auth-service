const usersCredentialsUsecase = require('../../usecases/user-credentials');

const makeCreateUserAction = require('./create-user-credentials');
const createUserCredentialsAction = makeCreateUserAction({
    createUserCredentialsUsecase: usersCredentialsUsecase.createUserCredentials,
});

module.exports = Object.freeze({
    createUserCredentialsAction,
});
const usersCredentialsDb = require('./user_credentials.db');
const authSessionsDb = require('./auth_sessions.db');
const invitationsDb = require('./invitations.db');

module.exports = Object.freeze({
    usersCredentialsDb,
    authSessionsDb,
    invitationsDb,
});
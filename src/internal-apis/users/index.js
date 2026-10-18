const axios = require('axios');
const { userService } = require('../../config/backend_config');

const makeGetUserByLinknameAndEmail = require('./get-user-by-linkname-and-email');
const getUserByLinknameAndEmail = makeGetUserByLinknameAndEmail({
    axios,
    userService,
});

module.exports = {
    getUserByLinknameAndEmail,
}
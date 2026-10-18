module.exports = function makeUserLogin({
    Joi,
    userService,
    hashPassword,
    verifyPassword,
    usersCredentialsDb,
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    authSessionsDb,
}) {
    return async function userLogin({
        linkname, email, password
    }) {
        console.log('userLogin usecase called', {
            linkname, email
        });

        try {
            // validatin userInput
            validateInput({
                linkname, email, password
            });

            // get user details and check user status from internal service call to users.
            const userDetails = await userService.getUserByLinknameAndEmail({ linkname, email });

            if (!(userDetails && userDetails.status === 'completed')) {
                // throw error as user is either deactivated or not completed the registration process properly.
                throw new Error('Not an active user!');
            }

            // get credentials for password hash.
            const userCredentials = await usersCredentialsDb.getUserCredentialsByDomainAndUserId({
                domain: linkname, userId: userDetails.id,
            });

            if (!(userCredentials && userCredentials.password_hash)) {
                throw new Error('User not Found!');
            }

            const passwordHash = userCredentials.password_hash;
            const isValidPassword = await verifyPassword(passwordHash, password);

            if (!isValidPassword) {
                throw new Error('User with this email and password not found, Please try again!');
            }

            // generating new accessToken and refreshToken.
            const accessToken = generateAccessToken({ userId: userDetails.id, linkname });

            // generating random refresh token and keeping user to refresh token mapping controlled by login usecase
            const token = generateRefreshToken();
            const refreshTokenHash = hashRefreshToken(token);

            if (token && refreshTokenHash) {
                // store it inside the auth_sessions table for session management.
                const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                await authSessionsDb.createAuthSession({
                    linkname, userId: userDetails.id, refreshTokenHash, expiresAt,
                })
            }

            return {
                accessToken,
                refreshToken: token,
                tokenType: "Bearer",
                expiresIn: "900 secs",
            }

        } catch (e) {
            console.log(e)
        }

        function validateInput({
            linkname, email, password
        }) {
            const schema = Joi.object({
                linkname: Joi.string().required(),
                email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
                password: Joi.string().required(),
            });
            const { error } = schema.validate({
                linkname, email, password
            });
            if (error) {
                throw new Error(error.message);
            }
        }
    }
}
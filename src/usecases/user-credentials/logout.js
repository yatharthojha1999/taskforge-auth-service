module.exports = function makeLogout({
    Joi,
    hashRefreshToken,
    authSessionsDb,
    makeAppError,
}) {
    return async function logout({ refreshToken }) {
        const schema = Joi.object({
            refreshToken: Joi.string().trim().required(),
        });

        const { error } = schema.validate({ refreshToken });

        if (error) {
            throw makeAppError("Refresh token is required.", 400);
        }

        const refreshTokenHash = hashRefreshToken(refreshToken);

        await authSessionsDb.revokeAuthSession({
            refreshTokenHash,
        });

        return {
            message: "Logged out successfully.",
        };
    };
};
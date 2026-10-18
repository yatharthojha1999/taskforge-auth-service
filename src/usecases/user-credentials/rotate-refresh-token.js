module.exports = function makeRotateRefreshToken({
    Joi,
    authSessionsDb,
    generateAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    makeAppError,
}) {
    return async function rotateRefreshToken({ refreshToken }) {
        validateInput({ refreshToken });

        const refreshTokenHash = hashRefreshToken(refreshToken);

        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

        const newExpiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        // The DB function locks and validates the session,
        // then performs the rotation in a transaction.
        let userSession;

        try {
            userSession = await authSessionsDb.rotateRefreshTokenSession({
                refreshTokenHash,
                newRefreshTokenHash,
                newExpiresAt,
            });
        } catch (error) {
            if (error.message === "Invalid refresh token. Please login again.") {
                throw makeAppError(
                    "Invalid refresh token. Please login again.",
                    401
                );
            }

            throw error;
        }

        const accessToken = generateAccessToken({
            userId: userSession.user_id,
            linkname: userSession.linkname,
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };

        function validateInput({ refreshToken }) {
            const schema = Joi.object({
                refreshToken: Joi.string().trim().required(),
            });

            const { error } = schema.validate({ refreshToken });

            if (error) {
                throw makeAppError("Refresh token is required.", 400);
            }
        }
    };
};
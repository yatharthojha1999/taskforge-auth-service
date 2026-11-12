module.exports = function makeCreateInvitation({
    Joi,
    invitationsDb,
    usersClient,
    emailService,
    invitationConfig,
    generateInvitationToken,
    hashInvitationToken,
}) {
    return async function createInvitation({
        userId,
        linkname,
        name,
        email,
    }) {
        const schema = Joi.object({
            userId: Joi.string().pattern(/^[1-9]\d*$/).required(),
            linkname: Joi.string().trim().min(1).required(),
            name: Joi.string().trim().min(1).max(255).required(),
            email: Joi.string().trim().email().required(),
        }).unknown(false);

        const { error, value } = schema.validate({
            userId,
            linkname,
            name,
            email,
        });

        if (error) {
            const validationError = new Error(error.message);
            validationError.statusCode = 400;
            throw validationError;
        }

        // Confirm that this user exists in this tenant and is pending.
        const user = await usersClient.getUserByLinknameAndEmail({
            linkname: value.linkname,
            email: value.email,
        });

        if (!user || user.status !== "pending" || user.email.toLowerCase() !== value.email.toLowerCase()) {
            const invalidUserError = new Error(
                "User is not eligible for an invitation"
            );
            invalidUserError.statusCode = 409;
            throw invalidUserError;
        }

        const token = generateInvitationToken();
        const tokenHash = hashInvitationToken(token);

        const ttlMs = invitationConfig.INVITATION_TTL_HOURS * 60 * 60 * 1000;

        const expiresAt = new Date(Date.now() + ttlMs);

        await invitationsDb.invalidatePendingInvitations({
            userId: value.userId,
            linkname: value.linkname,
        });

        await invitationsDb.createInvitation({
            userId: value.userId,
            linkname: value.linkname,
            email: value.email,
            tokenHash,
            expiresAt,
        });

        const invitationUrl = new URL(
            "/accept-invitation",
            invitationConfig.frontendUrl
        );
        invitationUrl.searchParams.set("token", token);

        await emailService.sendInvitation({
            to: value.email,
            name: value.name,
            invitationUrl: invitationUrl.toString(),
            expiresAt,
        });

        return {
            message: "Invitation sent successfully",
            expiresAt,
        };
    };
};

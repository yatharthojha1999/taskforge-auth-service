module.exports = function makeCreateUserCredentials({
    Joi,
    usersCredentialsDb,
    hashPassword,
}) {
    return async function createUserCredentials({
        linkname, userId, password
    }) {
        console.log('create user credentials usecase called', {
            linkname, userId
        });

        try {
            // validatin userInput
            validateInput({
                linkname, userId, password
            });

            // creating password hash for storing encrypted passwords.
            const passwordHash = await hashPassword(password);

            return await usersCredentialsDb.addUserCredentials({ linkname, userId, passwordHash });
        } catch (e) {
            console.log(e)
        }

        function validateInput({
            linkname, userId, password
        }) {
            const schema = Joi.object({
                linkname: Joi.string().required(),
                userId: Joi.number().required(),
                password: Joi.string().required(),
            });
            const { error } = schema.validate({
                linkname, userId, password
            });
            if (error) {
                throw new Error(error.message);
            }
        }
    }
}
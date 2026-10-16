module.exports = function makeCreateUserCredentialsAction({ createUserCredentialsUsecase }) {
    return async function createUserCredentialsAction(req, res) {
        console.log('createUserCredentialsAction Called!');
        const linkname = req.body["linkname"];
        const userId = req.body["userId"];
        const password = req.body["password"];

        const apiResult = await createUserCredentialsUsecase({
            linkname, userId, password
        })
        res.status(200).json(apiResult);
    }
}
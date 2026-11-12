module.exports = function makeCreateInvitationAction({ createInvitationUsecase }) {
    return async function createInvitationAction(req, res) {
        console.log('createInvitationAction Called!');
        const linkname = req.body["linkname"];
        const userId = req.body["userId"];
        const email = req.body["email"];
        const name = req.body["name"];

        const apiResult = await createInvitationUsecase({
            linkname, userId, email, name,
        })
        res.status(200).json(apiResult);
    }
}
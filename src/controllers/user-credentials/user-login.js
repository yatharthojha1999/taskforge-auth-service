module.exports = function makeUserLoginAction({ userLoginUsecase }) {
    return async function userLoginAction(req, res) {
        console.log('userLoginAction Called!');
        const linkname = req.body["linkname"];
        const email = req.body["email"];
        const password = req.body["password"];

        const apiResult = await userLoginUsecase({
            linkname, email, password
        })
        res.status(200).json(apiResult);
    }
}
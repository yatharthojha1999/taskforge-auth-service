module.exports = function makeLogoutAction({ logoutUsecase }) {
    return async function logoutAction(req, res) {
        console.log('rotateRefreshTokenAction Called!');
        const refreshToken = req.body["refreshToken"];

        const apiResult = await logoutUsecase({
            refreshToken
        })
        res.status(200).json(apiResult);
    }
}
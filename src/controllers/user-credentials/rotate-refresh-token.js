module.exports = function makeRotateRefreshTokenAction({ rotateRefreshTokenUsecase }) {
    return async function rotateRefreshTokenAction(req, res) {
        console.log('rotateRefreshTokenAction Called!');
        const refreshToken = req.body["refreshToken"];

        const apiResult = await rotateRefreshTokenUsecase({
            refreshToken
        })
        res.status(200).json(apiResult);
    }
}
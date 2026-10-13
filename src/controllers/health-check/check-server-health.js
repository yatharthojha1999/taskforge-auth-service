function makeCheckServerHealtAction({ healthCheckUsecase }) {
    return async function (req, res, next) {
        try {
            const result = await healthCheckUsecase();

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

module.exports = Object.freeze({
    makeCheckServerHealtAction
});
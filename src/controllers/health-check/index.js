const checkHealthUsecase = require('../../usecases/health-check');

const { makeCheckServerHealtAction } = require("./check-server-health.js");
const checkServerHealtAction = makeCheckServerHealtAction({
    healthCheckUsecase: checkHealthUsecase.checkServerHealt,
});

module.exports = Object.freeze({
    checkServerHealtAction,
});
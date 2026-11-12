
const axios = require("axios");
const { kafkaService } = require("../../config/backend_config");

const makePublishEvent = require("./publish-event");

const publishEvent = makePublishEvent({
    axios,
    kafkaService,
});

module.exports = Object.freeze({
    publishEvent,
});

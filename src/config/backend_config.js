module.exports = {
    userService: process.env.USER_SERVICE_URL || "http://localhost:3000",
    kafkaService: process.env.KAFKA_SERVICE_URL || "http://localhost:4000",
    invitationConfig: {
        INVITATION_TTL_HOURS = 24,
        FRONTEND_URL = "http://localhost:5173"
    }
}
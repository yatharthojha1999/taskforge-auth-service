
const express = require("express");
const { healthCheck, userCredentials } = require("./controllers");

const router = express.Router();

router.get("/health", healthCheck.checkServerHealtAction);

router.post("/internal/v1/credentials", userCredentials.createUserCredentialsAction);

module.exports = router;
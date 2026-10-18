
const express = require("express");
const { healthCheck, userCredentials } = require("./controllers");

const router = express.Router();

router.get("/health", healthCheck.checkServerHealtAction);

router.post("/internal/v1/credentials", userCredentials.createUserCredentialsAction);
router.post("/auth/v1/login", userCredentials.userLoginAction);
router.post("/auth/v1/refresh", userCredentials.rotateRefreshTokenAction);
router.post("/auth/v1/logout", userCredentials.logoutAction);

module.exports = router;
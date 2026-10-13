
const express = require("express");
const { healthCheck } = require("./controllers");

const router = express.Router();

router.get("/health", healthCheck.checkServerHealtAction);

module.exports = router;
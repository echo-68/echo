const express = require("express");
const router = express.Router();
const { generateEchoResponse } = require("../controllers/echoController");

router.post("/chat", generateEchoResponse);

module.exports = router;
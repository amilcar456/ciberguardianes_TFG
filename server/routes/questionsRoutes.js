const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionsController");

router.get("/:moduleId", getQuestions);

module.exports = router;

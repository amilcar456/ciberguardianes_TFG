const express = require("express");
const router = express.Router();
const { getModules } = require("../controllers/modulesController");

router.get("/", getModules);

module.exports = router;

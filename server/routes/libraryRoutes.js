const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

// Esta ruta responderá en: /library/all
router.get("/all", libraryController.getResources);

// AGREGAR: Recibe datos del formulario
router.post("/add", libraryController.addResource);

// ELIMINAR: Recibe el ID por la URL
router.delete("/delete/:id", libraryController.deleteResource);

module.exports = router;
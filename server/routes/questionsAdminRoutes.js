const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. Obtener todas las preguntas
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM questions");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener preguntas:", error);
        res.status(500).json({ error: "Error al obtener las preguntas" });
    }
});

// 2. Crear pregunta
router.post("/", async (req, res) => {
    try {
        const { module_id, question_text, correct_option, options_json } = req.body;
        
        // Importante: Si options_json viene como objeto/array desde el front, 
        // lo convertimos a string para que MySQL lo guarde bien.
        const optionsData = typeof options_json === 'string' ? options_json : JSON.stringify(options_json);

        await pool.query(
            "INSERT INTO questions (module_id, question_text, correct_option, options_json) VALUES (?, ?, ?, ?)",
            [module_id, question_text, correct_option, optionsData]
        );

        res.json({ message: "Pregunta creada con éxito" });
    } catch (error) {
        console.error("Error al crear:", error);
        res.status(500).json({ error: "No se pudo crear la pregunta" });
    }
});

// 3. Editar pregunta
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { module_id, question_text, correct_option, options_json } = req.body;

        const optionsData = typeof options_json === 'string' ? options_json : JSON.stringify(options_json);

        await pool.query(
            "UPDATE questions SET module_id=?, question_text=?, correct_option=?, options_json=? WHERE id=?",
            [module_id, question_text, correct_option, optionsData, id]
        );

        res.json({ message: "Pregunta actualizada correctamente" });
    } catch (error) {
        console.error("Error al editar:", error);
        res.status(500).json({ error: "Error al actualizar" });
    }
});

// 4. Eliminar pregunta
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM questions WHERE id=?", [id]);
        res.json({ message: "Pregunta eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ error: "No se pudo eliminar la pregunta" });
    }
});

module.exports = router;
const pool = require("../db");

// 1. OBTENER TODOS LOS RECURSOS (Ordenados por el más reciente)
exports.getResources = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM library_resources ORDER BY id DESC");
        
        // Si la tabla está vacía, enviamos un array vacío o podrías dejar el mensaje de error anterior
        res.json(rows);
    } catch (error) {
        console.error("DEBUG ERROR:", error);
        res.status(500).json({ error: "Error de servidor", detail: error.message });
    }
};

// 2. AGREGAR UN NUEVO RECURSO
exports.addResource = async (req, res) => {
    const { title, category, content, link_url } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO library_resources (title, category, content, link_url) VALUES (?, ?, ?, ?)",
            [title, category, content, link_url]
        );
        res.json({ message: "Recurso guardado con éxito", id: result.insertId });
    } catch (error) {
        console.error("ERROR AL AGREGAR:", error);
        res.status(500).json({ error: error.message });
    }
};

// 3. ELIMINAR UN RECURSO POR ID
exports.deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM library_resources WHERE id = ?", [id]);
        res.json({ message: "Recurso eliminado correctamente" });
    } catch (error) {
        console.error("ERROR AL ELIMINAR:", error);
        res.status(500).json({ error: error.message });
    }
};
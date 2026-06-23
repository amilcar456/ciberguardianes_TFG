const pool = require("../db");

exports.getModules = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM modules");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los módulos" });
  }
};

const pool = require("../db");

exports.getQuestions = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const [rows] = await pool.query("SELECT * FROM questions WHERE module_id = ?", [moduleId]);

        const processed = rows.map(q => {
            let opts = q.options_json;
            // Si MySQL manda el JSON como binario, lo pasamos a texto
            if (Buffer.isBuffer(opts)) opts = opts.toString('utf-8');
            
            try {
                // Intentamos convertir el texto en un Array real
                opts = (typeof opts === 'string') ? JSON.parse(opts) : opts;
            } catch (e) {
                opts = ["Error en formato"];
            }

            return { ...q, options_json: opts };
        });

        res.json(processed);
    } catch (err) {
        console.error("Error en DB:", err);
        res.status(500).json({ error: err.message });
    }
};
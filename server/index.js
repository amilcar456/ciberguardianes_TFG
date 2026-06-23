const express = require("express");
const cors = require("cors");
const pool = require("./db"); 

// 1. IMPORTACIONES
const modulesRoutes = require("./routes/modulesRoutes");
const questionsRoutes = require("./routes/questionsRoutes");
const questionsAdminRoutes = require("./routes/questionsAdminRoutes");
const libraryRoutes = require("./routes/libraryRoutes");

const app = express();

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. RUTAS EXISTENTES
app.use("/modules", modulesRoutes);
app.use("/questions", questionsRoutes);
app.use("/admin/questions", questionsAdminRoutes);
app.use("/library", libraryRoutes);

// --- RUTAS DE ADMINISTRACIÓN Y REPORTES ---

/**
 * A. Guardar resultados de misiones
 * Guarda el nombre, edad, misión y nota del estudiante
 */
app.post("/admin/save-result", async (req, res) => {
    console.log("📥 Datos recibidos del Quiz:", req.body);
    const { student_name, age, module_name, score } = req.body;
    
    try {
        const [result] = await pool.query(
            "INSERT INTO quiz_results (student_name, age, module_name, score) VALUES (?, ?, ?, ?)",
            [student_name, age, module_name, score]
        );
        console.log("✅ Éxito en DB! ID generado:", result.insertId);
        res.json({ message: "¡Misión registrada con éxito!" });
    } catch (error) {
        console.error("❌ ERROR AL INSERTAR EN DB:");
        console.error("Mensaje:", error.message);
        res.status(500).json({ error: "Error al guardar el resultado", detalle: error.message });
    }
});

/**
 * B. Obtener estadísticas para el Dashboard
 * Calcula Estudiantes únicos, Promedio general y últimos registros
 */
app.get("/admin/stats", async (req, res) => {
    try {
        // 1. Total de estudiantes únicos
        const [totalStudents] = await pool.query("SELECT COUNT(DISTINCT student_name) as total FROM quiz_results");
        
        // 2. Promedio general de todas las misiones
        const [avgScore] = await pool.query("SELECT AVG(score) as promedio FROM quiz_results");
        
        // 3. Total de cuestionarios realizados
        const [completedQuizzes] = await pool.query("SELECT COUNT(*) as total FROM quiz_results");
        
        // 4. Lista de los últimos 10 informes
        const [recentResults] = await pool.query(`
            SELECT student_name, module_name, score, 
            DATE_FORMAT(date_completed, '%Y-%m-%d %H:%i') as date 
            FROM quiz_results 
            ORDER BY date_completed DESC 
            LIMIT 10
        `);

        console.log("📊 Estadísticas calculadas y enviadas");

        res.json({
            totalStudents: totalStudents[0].total || 0,
            avgScore: Math.round(avgScore[0].promedio) || 0, // Enviamos el promedio redondeado
            completedQuizzes: completedQuizzes[0].total || 0,
            recentResults: recentResults
        });
    } catch (error) {
        console.error("❌ ERROR AL OBTENER STATS:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. ENCENDIDO DEL SERVIDOR
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de CiberGuardianes corriendo en http://localhost:${PORT}`);
  console.log("📡 Conectado a MySQL en el puerto configurado.");
});
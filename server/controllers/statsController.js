// Obtener lista de estudiantes únicos y sus intentos
exports.getStudentList = async (req, res) => {
    const [rows] = await pool.query("SELECT DISTINCT student_name, COUNT(*) as quizzes_done FROM quiz_results GROUP BY student_name");
    res.json(rows);
};

// Obtener estadísticas globales de comprensión
exports.getGlobalStats = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT 
            AVG(score) as average_score, 
            MAX(score) as top_score, 
            COUNT(*) as total_attempts 
        FROM quiz_results
    `);
    res.json(rows[0]);
};
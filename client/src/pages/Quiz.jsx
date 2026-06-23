import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Quiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [i, setI] = useState(0);
    const [score, setScore] = useState(0); 
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/questions/${id}`)
            .then(r => r.json())
            .then(d => {
                const cleanQuestions = d.map(q => {
                    let finalOptions = [];
                    let rawData = q.options_json;

                    try {
                        if (rawData && typeof rawData === 'object' && rawData.type === 'Buffer') {
                            const str = new TextDecoder().decode(new Uint8Array(rawData.data));
                            finalOptions = JSON.parse(str);
                        } 
                        else if (Array.isArray(rawData)) {
                            finalOptions = rawData;
                        } 
                        else if (typeof rawData === 'string' && rawData.trim().startsWith('[')) {
                            finalOptions = JSON.parse(rawData.trim());
                        }
                        else if (typeof rawData === 'string' && rawData.length > 0) {
                            finalOptions = rawData.split(',').map(s => s.trim().replace(/["'\[\]]/g, ''));
                        }
                    } catch (e) {
                        console.error("Error procesando opciones en pregunta ID:", q.id, e);
                    }

                    if (!finalOptions || finalOptions.length === 0) {
                        finalOptions = ["Opcion A (Error)", "Opcion B (Error)", "Opcion C (Error)"];
                    }

                    return { ...q, options_json: finalOptions };
                });
                setQuestions(cleanQuestions);
            })
            .catch(err => console.error("Error de conexión con el servidor:", err));
    }, [id]);

    // --- NUEVA FUNCIÓN PARA ENVIAR REPORTE AL ADMIN ---
    const enviarReporteMision = async (puntosFinales) => {
        const nombreHeroe = localStorage.getItem("heroName") || "Héroe Anónimo";
        const edadHeroe = localStorage.getItem("heroAge") || 0;

        const reporte = {
            student_name: nombreHeroe,
            age: parseInt(edadHeroe),
            module_name: `Misión ${id}`, // Puedes cambiar esto por un nombre real si lo tienes
            score: puntosFinales
        };

        try {
            await fetch("http://localhost:3001/admin/save-result", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reporte)
            });

            // Actualizamos contador local para el Rango en Modules.jsx
            const stats = JSON.parse(localStorage.getItem("heroStats")) || { completed: 0 };
            localStorage.setItem("heroStats", JSON.stringify({
                completed: stats.completed + 1
            }));
        } catch (error) {
            console.error("Error al enviar reporte:", error);
        }
    };

    function handleNext() {
        if (selected === null) return;

        const isCorrect = selected === (questions[i].correct_option - 1);
        const pointsToAdd = isCorrect ? 10 : 0;
        const newScore = score + pointsToAdd;

        if (i + 1 < questions.length) {
            setScore(newScore);
            setI(i + 1);
            setSelected(null);
        } else {
            // --- AQUÍ ENVIAMOS LOS DATOS ANTES DE NAVEGAR ---
            const finalCorrectCount = isCorrect ? (score / 10) + 1 : (score / 10);
            
            // Calculamos el porcentaje final (ej: de 0 a 100)
            const finalPercentage = Math.round((newScore / (questions.length * 10)) * 100);
            
            enviarReporteMision(finalPercentage); // Enviamos el porcentaje al Admin

            navigate("/results", { 
                state: { 
                    score: newScore, 
                    totalQuestions: questions.length,
                    correctCount: finalCorrectCount
                } 
            });
        }
    }

    if (questions.length === 0) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-sans">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            <p className="ml-4 font-black uppercase tracking-widest italic">Sincronizando Base de Datos...</p>
        </div>
    );

    const currentQuestion = questions[i];
    const opts = currentQuestion.options_json;

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center justify-center font-sans">
            
            <div className="max-w-2xl w-full flex justify-between items-center mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-xl">
                    <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Misión {id}</span>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/50 px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                    <span className="text-yellow-400 font-black text-sm tracking-tighter uppercase">
                        Héroe: <span className="text-white mr-3">{localStorage.getItem("heroName") || "---"}</span>
                        PUNTOS: <span className="text-xl ml-2">{score.toString().padStart(4, '0')}</span>
                    </span>
                </div>
            </div>

            <div className="max-w-2xl w-full mb-10">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-[1px]">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-300 rounded-full transition-all duration-700"
                        style={{ width: `${((i + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="relative max-w-2xl w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-10"></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-center leading-tight mb-10">
                        {currentQuestion.question_text}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {opts.map((opt, index) => (
                            <button
                                key={`${currentQuestion.id}-${index}`} 
                                onClick={() => setSelected(index)}
                                className={`
                                    w-full p-5 rounded-2xl font-bold text-left transition-all duration-200 border-2 flex items-center gap-4
                                    ${selected === index 
                                        ? 'border-blue-400 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                        : 'border-slate-800 bg-slate-800/30 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50'}
                                `}
                            >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 font-black transition-colors ${selected === index ? 'border-blue-400 bg-blue-400 text-slate-900' : 'border-slate-700'}`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={selected === null}
                        className={`
                            mt-10 w-full py-5 rounded-2xl font-black text-lg transition-all
                            ${selected === null 
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' 
                                : 'bg-white text-slate-900 shadow-[0_6px_0_#cbd5e1] hover:brightness-110 active:translate-y-1 active:shadow-none'}
                            uppercase tracking-[0.2em]
                        `}
                    >
                        Confirmar Selección 🛡️
                    </button>
                </div>
            </div>
        </div>
    );
}
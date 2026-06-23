import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showConfetti, setShowConfetti] = useState(false);
    
    const { score, totalQuestions, correctCount } = location.state || { score: 0, totalQuestions: 0, correctCount: 0 };
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    useEffect(() => {
        if (percentage >= 70) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000); // El confeti dura 5 segundos
            return () => clearTimeout(timer);
        }
    }, [percentage]);

    const getRank = () => {
        if (percentage === 100) return { title: "MAESTRO CIBERGUARDIÁN", medal: "🏆", color: "text-yellow-400", bg: "from-yellow-500/20 to-orange-600/20" };
        if (percentage >= 70) return { title: "GUARDIÁN AVANZADO", medal: "🥈", color: "text-blue-300", bg: "from-blue-500/20 to-indigo-600/20" };
        return { title: "RECLUTA EN ENTRENAMIENTO", medal: "🥉", color: "text-slate-400", bg: "from-slate-500/20 to-slate-700/20" };
    };

    const rank = getRank();

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
            
            {/* EFECTO CONFETI (Solo si aprobaron con >= 70%) */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                backgroundColor: ['#3b82f6', '#facc15', '#ef4444', '#10b981', '#a855f7'][Math.floor(Math.random() * 5)],
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 20 + 10}px`,
                                borderRadius: '2px',
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${Math.random() * 2 + 2}s`,
                                opacity: Math.random()
                            }}
                        />
                    ))}
                </div>
            )}

            <div className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r ${rank.bg} blur-[120px] opacity-30 animate-pulse`}></div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-2 animate-bounce">
                    ¡MISIÓN CUMPLIDA!
                </h1>
                
                <div className="bg-slate-900/80 border-2 border-slate-800 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md border-t-blue-500/50 relative">
                    <div className="text-8xl md:text-9xl mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:rotate-12 transition-transform">
                        {rank.medal}
                    </div>

                    <h2 className={`text-3xl md:text-4xl font-black mb-8 ${rank.color}`}>
                        {rank.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                            <p className="text-slate-500 text-xs font-black uppercase mb-1">Puntos</p>
                            <p className="text-3xl font-black text-white">{score}</p>
                        </div>
                        <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                            <p className="text-slate-500 text-xs font-black uppercase mb-1">Efectividad</p>
                            <p className="text-3xl font-black text-white">{Math.round(percentage)}%</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => navigate("/modules")}
                            className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl shadow-[0_6px_0_#cbd5e1] hover:translate-y-[2px] active:translate-y-[6px] transition-all uppercase tracking-widest text-lg"
                        >
                            Siguiente Misión ➔
                        </button>

                        <button 
                            onClick={() => navigate("/")}
                            className="w-full bg-transparent border-2 border-slate-700 text-slate-500 font-black py-4 rounded-2xl hover:text-white transition-all uppercase tracking-widest text-sm"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
            `}</style>
        </div>
    );
}
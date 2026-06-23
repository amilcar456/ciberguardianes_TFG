import { Link, useParams } from "react-router-dom";

export default function ModuleIntro() {
    const { id } = useParams();

    // Configuración de colores y textos por ID de módulo
    const missionData = {
        "1": {
            title: "Escudo de Contraseñas",
            emoji: "🔐",
            color: "from-green-400 to-emerald-600",
            shadow: "shadow-emerald-900/50",
            instruction: "¡Hola Guardián! Tu misión es crear llaves maestras. Una contraseña segura es un escudo invisible para tus tesoros.",
            tasks: ["No uses tu nombre.", "Mezcla letras y números.", "¡No la compartas!"]
        },
        "2": {
            title: "Caza Trampas",
            emoji: "🕵️‍♂️",
            color: "from-blue-400 to-indigo-600",
            shadow: "shadow-indigo-900/50",
            instruction: "¡Alerta de Phishing! Aprende a reconocer correos falsos y mensajes de extraños antes de que muerdan el anzuelo.",
            tasks: ["Revisa el remitente.", "No hagas clic en links raros.", "Desconfía de premios gratis."]
        },
        "3": {
            title: "Mundo Social",
            emoji: "📱",
            color: "from-purple-400 to-pink-600",
            shadow: "shadow-pink-900/50",
            instruction: "Navega con seguridad. Aprende qué puedes compartir y cómo proteger tu privacidad con tus amigos.",
            tasks: ["Pide permiso antes de subir fotos.", "Habla solo con conocidos.", "Cuida tu información personal."]
        }
    };

    // Obtenemos los datos según el ID, o unos por defecto si no existe
    const info = missionData[id] || missionData["1"];

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
            
            {/* FONDO AMBIENTAL */}
            <div className={`absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-b ${info.color} pointer-events-none`}></div>

            <div className="relative z-10 max-w-3xl w-full">
                
                {/* CABECERA */}
                <div className="text-center mb-10">
                    <div className="inline-block bg-white/10 border border-white/20 px-4 py-1 rounded-full text-white text-[10px] font-black tracking-[0.3em] uppercase mb-4 backdrop-blur-md">
                        Misión Autorizada
                    </div>
                    <h1 className={`text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl`}>
                        {info.emoji} {info.title}
                    </h1>
                </div>

                {/* TARJETA DE BRIEFING */}
                <div className="bg-slate-900/90 border-2 border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-md relative overflow-hidden">
                    
                    {/* Barra lateral de color dinámico */}
                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${info.color}`}></div>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm mb-3">
                                Mensaje del Comandante:
                            </h3>
                            <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic">
                                "{info.instruction}"
                            </p>
                        </section>

                        <section className="bg-black/40 rounded-3xl p-6 border border-white/5">
                            <h4 className="text-yellow-400 font-black uppercase text-[10px] mb-4 flex items-center gap-2 tracking-widest">
                                <span className="animate-ping w-2 h-2 bg-yellow-400 rounded-full"></span>
                                Objetivos Tácticos:
                            </h4>
                            <ul className="space-y-3">
                                {info.tasks.map((task, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold">
                                        <span className="text-white/40 font-black">0{idx + 1}.</span>
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* BOTONES */}
                    <div className="mt-12 flex flex-col gap-4">
                        
                        {/* BOTÓN CON COLOR DINÁMICO */}
                        <Link to={`/quiz/${id}`} className="w-full">
                            <button className={`group relative w-full bg-gradient-to-r ${info.color} text-white font-black py-6 rounded-2xl shadow-xl hover:brightness-110 hover:-translate-y-1 active:translate-y-1 transition-all uppercase tracking-[0.2em] text-xl overflow-hidden`}>
                                <span className="relative z-10 drop-shadow-md">¡INICIAR DESAFÍO! 🚀</span>
                                
                                {/* Brillo animado */}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </button>
                        </Link>

                        {/* BOTÓN VOLVER */}
                        <Link to="/modules" className="w-full">
                            <button className="w-full bg-transparent border-2 border-slate-700 text-slate-500 font-black py-4 rounded-2xl hover:border-slate-500 hover:text-slate-300 transition-all uppercase tracking-widest text-sm">
                                CANCELAR Y VOLVER
                            </button>
                        </Link>
                        
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { left: 150%; }
                }
            `}</style>
        </div>
    );
}
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            
            {/* --- BOTÓN DE ADMINISTRADOR (ESQUINA SUPERIOR DERECHA) --- */}
            <div className="absolute top-6 right-6 z-50">
                <Link to="/admin">
                    <button className="group relative flex items-center gap-2 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-md">
                        {/* Pequeño indicador de pulso rojo (seguridad) */}
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-slate-400 group-hover:text-blue-300 text-[10px] font-black tracking-[0.2em] uppercase">
                            Panel Admin
                        </span>
                    </button>
                </Link>
            </div>

            {/* LUCES DE FONDO AMBIENTALES */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>

            <div className="relative z-10 text-center max-w-4xl w-full flex flex-col items-center">
                
                {/* 1. TÍTULO */}
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-500 drop-shadow-[0_10px_20px_rgba(59,130,246,0.5)] leading-none">
                    CIBERGUARDIANES
                </h1>

                {/* 2. IMAGEN CENTRAL CON MARCO NEÓN */}
                <div className="relative mt-8 mb-10 group">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-600 rounded-[3rem] blur opacity-75 group-hover:opacity-100 animate-pulse transition duration-1000"></div>
                    
                    <div className="relative bg-slate-900 rounded-[2.8rem] p-2 shadow-2xl overflow-hidden">
                        <img
                            src="/inicio.png"
                            alt="Imagen infantil"
                            className="w-64 md:w-80 lg:w-96 rounded-[2.2rem] object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>

                {/* 3. SUBTITULO */}
                <div className="inline-block bg-blue-500/10 border border-blue-400/30 px-6 py-2 rounded-full mb-12 backdrop-blur-md">
                    <p className="text-blue-300 font-bold tracking-[0.2em] uppercase text-sm">
                        Aprende • Juega • Navega Seguro
                    </p>
                </div>

                {/* 4. BOTONES PRINCIPALES */}
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full">
                    <Link to="/modules" className="w-full md:w-auto">
                        <button className="group relative w-full md:w-72 bg-white text-slate-900 font-black py-5 rounded-2xl shadow-[0_6px_0_#cbd5e1] hover:shadow-[0_4px_0_#cbd5e1] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest text-lg">
                            EMPEZAR MISIÓN 🚀
                        </button>
                    </Link>

                    <Link to="/library" className="w-full md:w-auto">
                        <button className="w-full md:w-72 bg-slate-900 border-2 border-slate-700 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 hover:border-blue-400/50 transition-all uppercase tracking-widest text-lg">
                            MI BIBLIOTECA 📚
                        </button>
                    </Link>
                </div>
            </div>

            {/* VERSIÓN */}
            <div className="absolute bottom-6 text-slate-500 font-bold text-xs tracking-widest uppercase">
                Sistema de Seguridad Infantil v1.0
            </div>
        </div>
    );
}
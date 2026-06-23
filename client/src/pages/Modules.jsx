import { useState } from "react";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    id: 1,
    title: "Escudo de Contraseñas",
    emoji: "🔐",
    color: "from-green-400 to-emerald-600",
    offset: "md:-translate-x-20"
  },
  {
    id: 2,
    title: "Caza Trampas",
    emoji: "🕵️‍♂️",
    color: "from-blue-400 to-indigo-600",
    offset: "md:translate-x-20"
  },
  {
    id: 3,
    title: "Mundo Social",
    emoji: "📱",
    color: "from-purple-400 to-pink-600",
    offset: "md:-translate-x-10"
  }
];

export default function Modules() {
  const navigate = useNavigate();
  
  // --- ESTADOS ---
  const [showModal, setShowModal] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [heroData, setHeroData] = useState({
    name: localStorage.getItem("heroName") || "",
    age: localStorage.getItem("heroAge") || ""
  });

  // --- LÓGICA DE RANGO ---
  const getRank = () => {
    const stats = JSON.parse(localStorage.getItem("heroStats")) || { completed: 0 };
    if (stats.completed >= 3) return { name: "LEYENDA", color: "text-purple-500", icon: "👑" };
    if (stats.completed === 2) return { name: "VETERANO", color: "text-orange-500", icon: "🎖️" };
    if (stats.completed === 1) return { name: "EXPLORADOR", color: "text-emerald-500", icon: "🛡️" };
    return { name: "NOVATO", color: "text-yellow-400", icon: "👶" };
  };

  const rank = getRank();

  // --- FUNCIONES ---
  const handleStart = (id) => {
    if (!heroData.name) {
      setSelectedId(id);
      setShowModal(true);
    } else {
      navigate(`/module/${id}`);
    }
  };

  const saveHero = (e) => {
    e.preventDefault();
    localStorage.setItem("heroName", heroData.name);
    localStorage.setItem("heroAge", heroData.age);
    setShowModal(false);
    // Forzamos actualización visual del nombre en el footer
    setHeroData({ name: heroData.name, age: heroData.age });
    navigate(`/module/${selectedId}`);
  };

  const confirmChangeHero = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5 font-sans relative">
      
      {/* 1. MODAL DE AVISO: CAMBIAR USUARIO */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-900 border-2 border-red-500/50 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-black mb-2 uppercase italic text-red-500">¿ESTÁS SEGURO?</h2>
            <p className="text-slate-400 text-sm font-bold mb-8 uppercase">
              Perderás tu rango actual de <span className={rank.color}>{rank.name}</span>.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={confirmChangeHero} className="w-full bg-red-600 py-4 rounded-2xl font-black uppercase">SÍ, CAMBIAR 🔄</button>
              <button onClick={() => setShowConfirmExit(false)} className="w-full bg-slate-800 py-3 rounded-2xl font-black text-xs text-slate-400 uppercase">CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL DE REGISTRO INICIAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border-2 border-blue-500 p-8 rounded-[3rem] max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-black text-center mb-6 uppercase italic">Registro de Héroe 🛡️</h2>
            <form onSubmit={saveHero} className="space-y-4">
              <input required className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700 font-bold outline-none focus:border-blue-500 text-white" placeholder="Tu nombre" value={heroData.name} onChange={(e) => setHeroData({...heroData, name: e.target.value})} />
              <input required type="number" className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700 font-bold outline-none focus:border-blue-500 text-white" placeholder="Tu edad" value={heroData.age} onChange={(e) => setHeroData({...heroData, age: e.target.value})} />
              <button className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase">¡Empezar!</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CABECERA */}
      <header className="text-center py-10">
        <h1 className="text-6xl font-black tracking-tighter text-blue-500 uppercase italic">CiberGuardianes</h1>
        <p className="text-slate-500 font-bold tracking-[0.3em] text-xs mt-2 uppercase">— Panel de Misiones —</p>
      </header>

      {/* 4. LISTADO DE MISIONES (Lo que había desaparecido) */}
      <main className="max-w-4xl mx-auto flex flex-col items-center gap-10 py-5">
        {modules.map((m) => (
          <div 
            key={m.id} 
            onClick={() => handleStart(m.id)}
            className={`cursor-pointer transform hover:scale-105 transition-all active:scale-95 ${m.offset}`}
          >
            <div className="bg-slate-900 border-2 border-slate-800 p-1 rounded-[2.5rem] w-72 md:w-80 overflow-hidden shadow-2xl">
              <div className={`bg-gradient-to-br ${m.color} p-6 rounded-[2.3rem] text-center`}>
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/30">
                  {m.emoji}
                </div>
                <p className="text-[10px] font-black uppercase opacity-70 mb-1">Misión 0{m.id}</p>
                <h3 className="text-xl font-black text-white mb-4 uppercase">{m.title}</h3>
                <div className="bg-white text-slate-900 font-black py-2 rounded-xl text-xs uppercase shadow-[0_4px_0_#cbd5e1]">
                  Entrar 🚀
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 5. FOOTER */}
      <footer className="mt-10 border-t border-slate-900 p-6 flex justify-around items-center bg-slate-900/40 rounded-t-[3rem] backdrop-blur-md">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Guardián</p>
          <p className="font-black text-lg italic text-white leading-none">{heroData.name || "???"}</p>
          {heroData.name && (
            <button onClick={() => setShowConfirmExit(true)} className="mt-2 text-[9px] font-black bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-xl uppercase">
              Cambiar Usuario 🔄
            </button>
          )}
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Rango</p>
          <p className={`font-black text-lg italic uppercase ${rank.color} leading-none`}>
            {rank.icon} {rank.name}
          </p>
        </div>
      </footer>
    </div>
  );
}
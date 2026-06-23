import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Estados para el Modal y Seguridad
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  
  // Estado para los datos del servidor
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgScore: 0,
    completedQuizzes: 0,
    recentResults: []
  });

  // Cargar datos del servidor al montar el componente
  useEffect(() => {
    fetch("http://localhost:3001/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error cargando estadísticas:", err));
  }, []);

  // Función para validar la contraseña del gestor de preguntas
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setShowAuthModal(false);
      navigate("/admin/questions");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans relative">
      
      {/* --- MODAL DE SEGURIDAD PERSONALIZADO --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-cyan-500/40 p-8 rounded-[2.5rem] shadow-[0_0_60px_rgba(6,182,212,0.2)] max-w-sm w-full border-t-8 border-t-cyan-500">
            <div className="text-center mb-8">
              <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Acceso de Admin</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase mt-1 tracking-widest">Verificación de Identidad</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                autoFocus
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-950 border ${error ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-2xl p-4 text-center font-black tracking-[0.5em] focus:border-cyan-500 outline-none transition-all text-cyan-400`}
              />
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => { setShowAuthModal(false); setError(false); }}
                  className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-cyan-500 text-slate-950 py-4 rounded-2xl font-black text-xs uppercase shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-black italic tracking-tighter text-cyan-500 uppercase leading-none">Control Center</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] mt-2">CyberGuardianes Protocol 🛡️</p>
        </div>
        <button 
          onClick={() => navigate("/")} 
          className="group flex items-center gap-3 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl hover:border-red-500/50 transition-all shadow-xl"
        >
          <span className="text-xl">🏠</span>
          <div className="text-left">
            <p className="text-[10px] text-slate-500 font-black uppercase leading-none text-nowrap">Finalizar</p>
            <p className="text-sm font-black uppercase text-white tracking-wider text-nowrap">Ir al Inicio</p>
          </div>
        </button>
      </header>

      {/* --- NAVEGACIÓN --- */}
      <nav className="max-w-7xl mx-auto flex gap-4 mb-12">
        <button className="bg-cyan-500 text-slate-950 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          📊 Estadísticas
        </button>
        <button 
          onClick={() => setShowAuthModal(true)} 
          className="bg-slate-900 text-slate-400 border border-slate-800 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:text-white hover:border-cyan-500 transition-all"
        >
          📝 Preguntas
        </button>
      </nav>

      {/* --- CONTENIDO DE ESTADÍSTICAS --- */}
      <main className="max-w-7xl mx-auto space-y-10">
        
        {/* TARJETAS KPI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">👤</div>
            <p className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-[0.2em]">Estudiantes Únicos</p>
            <h2 className="text-6xl font-black text-white">{stats.totalStudents}</h2>
            <div className="h-1.5 w-12 bg-blue-500 mt-6 rounded-full"></div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">🎯</div>
            <p className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-[0.2em]">Promedio General</p>
            <div className="flex items-baseline gap-2">
              <h2 className={`text-6xl font-black ${stats.avgScore >= 70 ? 'text-emerald-400' : 'text-orange-400'}`}>
                {stats.avgScore}
              </h2>
              <span className="text-2xl font-black text-slate-700">%</span>
            </div>
            <div className={`h-1.5 w-12 mt-6 rounded-full ${stats.avgScore >= 70 ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">🚀</div>
            <p className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-[0.2em]">Misiones Realizadas</p>
            <h2 className="text-6xl font-black text-white">{stats.completedQuizzes}</h2>
            <div className="h-1.5 w-12 bg-purple-500 mt-6 rounded-full"></div>
          </div>
        </section>

        {/* TABLA DE ACTIVIDAD */}
        <section className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-black uppercase italic text-slate-400 tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span>
              Reportes de Misión en Tiempo Real
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-8">Agente / Héroe</th>
                  <th className="p-8">Misión Asignada</th>
                  <th className="p-8 text-center">Rendimiento</th>
                  <th className="p-8 text-right">Fecha Estelar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stats.recentResults.length > 0 ? (
                  stats.recentResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-cyan-500/5 transition-colors group">
                      <td className="p-8">
                        <p className="font-black text-white group-hover:text-cyan-400 transition-colors uppercase italic tracking-tight">{row.student_name}</p>
                      </td>
                      <td className="p-8">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">{row.module_name}</span>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-5 py-2 rounded-xl font-black text-sm border ${row.score >= 70 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {row.score}%
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter italic">{row.date}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-32 text-center text-slate-700 uppercase font-black italic tracking-widest text-lg">
                      Esperando datos del sistema...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
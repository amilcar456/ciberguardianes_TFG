import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importamos Link para la navegación

export default function Library() {
    const [resources, setResources] = useState([]);

    // FUNCIÓN PARA DEFINIR ICONO Y COLORES SEGÚN CATEGORÍA
    const getStyle = (category) => {
        const cat = category ? category.toLowerCase() : '';
        switch (cat) {
            case 'video': 
                return { icon: '🎥', color: 'border-red-500/50 text-red-400 bg-red-500/5' };
            case 'lectura': 
                return { icon: '📖', color: 'border-blue-500/50 text-blue-400 bg-blue-500/5' };
            case 'guía': 
                return { icon: '🗺️', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5' };
            case 'tip': 
                return { icon: '💡', color: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/5' };
            default: 
                return { icon: '🛡️', color: 'border-slate-700 text-slate-400 bg-slate-800/5' };
        }
    };

    useEffect(() => {
        fetch("http://localhost:3001/library/all")
            .then(res => res.json())
            .then(data => setResources(data))
            .catch(err => console.error("Error:", err));
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 font-sans relative">
            
            {/* BOTÓN DE ADMIN (PANEL DE CONTROL) */}
            <div className="absolute top-8 right-8">
                <Link 
                    to="/admin/library" 
                    className="flex items-center gap-2 bg-slate-900/80 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-400 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 group shadow-lg shadow-cyan-500/10"
                >
                    <span className="text-lg group-hover:rotate-90 transition-transform duration-500">⚙️</span>
                    PANEL DE CONTROL
                </Link>
            </div>

            <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                MI BIBLIOTECA DE GUARDIÁN 📚
            </h1>
            <p className="text-slate-400 mb-10">Aprende los secretos para proteger el internet.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((item) => {
                    const style = getStyle(item.category);
                    
                    return (
                        <div key={item.id} className={`group relative bg-slate-900 border ${style.color} p-6 rounded-[2rem] hover:scale-[1.02] transition-all duration-300 shadow-xl`}>
                            
                            <div className="text-4xl mb-4 group-hover:rotate-12 transition-transform">
                                {style.icon}
                            </div>

                            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-current/10 ${style.color}`}>
                                {item.category}
                            </span>
                            
                            <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{item.content}</p>
                            
                            <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold hover:underline">
                                Abrir Recurso →
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
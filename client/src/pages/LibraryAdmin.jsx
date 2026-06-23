import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LibraryAdmin() {
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({
        title: "",
        category: "Lectura",
        content: "",
        link_url: ""
    });

    // --- ESTADOS DE SEGURIDAD ---
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("admin_auth") === "true");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");
    const CLAVE_SECRETA = "admin123"; // <--- CAMBIA TU CLAVE AQUÍ

    // Estados para el Modal de Confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // 1. Cargar recursos existentes
    const fetchResources = () => {
        fetch("http://localhost:3001/library/all")
            .then(res => res.json())
            .then(data => setResources(data))
            .catch(err => console.error("Error al cargar:", err));
    };

    useEffect(() => { 
        if (isAuthenticated) fetchResources(); 
    }, [isAuthenticated]);

    // Lógica de Login
    const handleLogin = (e) => {
        e.preventDefault();
        if (passwordInput === CLAVE_SECRETA) {
            setIsAuthenticated(true);
            localStorage.setItem("admin_auth", "true");
            setError("");
        } else {
            setError("❌ Clave incorrecta. Solo guardianes autorizados.");
        }
    };

    // Cerrar Sesión (Opcional)
    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_auth");
    };

    // 2. Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3001/library/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newResource)
            });
            if (res.ok) {
                setNewResource({ title: "", category: "Lectura", content: "", link_url: "" });
                fetchResources();
            }
        } catch (err) { console.error(err); }
    };

    // 3. Lógica para el Modal de Eliminación
    const openDeleteModal = (id) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`http://localhost:3001/library/delete/${selectedId}`, { 
                method: "DELETE" 
            });
            if (res.ok) {
                fetchResources();
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Error al eliminar:", err);
        }
    };

    // --- VISTA DE LOGIN SI NO ESTÁ AUTENTICADO ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
                <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl text-center max-w-md w-full animate-in fade-in zoom-in duration-300">
                    <div className="text-6xl mb-6">🔐</div>
                    <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter text-cyan-400">Acceso Privado</h2>
                    <p className="text-slate-400 text-sm mb-8">Ingresa la clave de guardián para gestionar la biblioteca.</p>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="password"
                            placeholder="Contraseña Maestra"
                            className="w-full bg-slate-800 p-4 rounded-2xl border border-slate-700 outline-none focus:border-cyan-500 transition-all text-center text-lg"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            autoFocus
                        />
                        {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 py-2 rounded-lg">{error}</p>}
                        
                        <button className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-black transition-all shadow-lg shadow-cyan-900/40">
                            ENTRAR AL PANEL
                        </button>
                    </form>
                    
                    <Link to="/library" className="inline-block mt-8 text-slate-500 hover:text-white text-xs underline decoration-cyan-500/50 underline-offset-4">
                        ← Volver a la biblioteca pública
                    </Link>
                </div>
            </div>
        );
    }

    // --- VISTA DEL PANEL (SOLO SE VE SI isAuthenticated ES TRUE) ---
    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 font-sans">
            
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-tighter">
                        Panel: Biblioteca 🛠️
                    </h1>
                    <button onClick={handleLogout} className="text-[10px] text-red-400 hover:underline uppercase font-bold tracking-widest mt-1">
                        Cerrar Sesión Segura
                    </button>
                </div>
                <Link to="/library" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">
                    ← VOLVER A LA BIBLIOTECA
                </Link>
            </div>

            {/* FORMULARIO PARA AGREGAR */}
            <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 mb-10 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 focus:border-cyan-500 outline-none transition-all"
                        placeholder="Título del Recurso"
                        value={newResource.title}
                        onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                        required
                    />
                    <select 
                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 outline-none focus:border-cyan-500"
                        value={newResource.category}
                        onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                    >
                        <option value="Lectura">📖 Lectura</option>
                        <option value="Video">🎥 Video</option>
                        <option value="Tip">💡 Tip</option>
                        <option value="Guía">🗺️ Guía</option>
                    </select>
                    <textarea 
                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 md:col-span-2 outline-none focus:border-cyan-500"
                        placeholder="Descripción para los niños..."
                        value={newResource.content}
                        onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                        required
                    />
                    <input 
                        className="bg-slate-800 p-4 rounded-xl border border-slate-700 md:col-span-2 outline-none focus:border-cyan-500"
                        placeholder="URL del recurso (https://...)"
                        value={newResource.link_url}
                        onChange={(e) => setNewResource({...newResource, link_url: e.target.value})}
                    />
                </div>
                <button className="mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 px-8 rounded-xl transition-all shadow-lg shadow-cyan-900/20">
                    + AÑADIR NUEVO RECURSO
                </button>
            </form>

            {/* LISTADO DE RECURSOS */}
            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-800/50">
                        <tr className="text-slate-500 uppercase text-xs tracking-widest">
                            <th className="p-6">Título</th>
                            <th className="p-6">Categoría</th>
                            <th className="p-6 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((res) => (
                            <tr key={res.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                <td className="p-6 font-bold text-slate-200">{res.title}</td>
                                <td className="p-6">
                                    <span className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                        {res.category}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button 
                                        onClick={() => openDeleteModal(res.id)} 
                                        className="text-red-500 hover:text-red-400 font-bold text-sm hover:underline"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl">
                        <div className="text-6xl mb-4">🚨</div>
                        <h2 className="text-2xl font-black mb-2 uppercase">¿Estás seguro?</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            Este recurso desaparecerá de la biblioteca para siempre.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold transition-all">
                                Cancelar
                            </button>
                            <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold transition-all">
                                Sí, borrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
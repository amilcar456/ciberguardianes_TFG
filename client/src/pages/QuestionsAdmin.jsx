import { useEffect, useState } from "react";

export default function QuestionAdmin() {
    const [questions, setQuestions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ 
        id: null, 
        module_id: 1, 
        question_text: "", 
        options: ["", "", ""], 
        correct_option: 1 
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    // 1. OBTENER PREGUNTAS
    const fetchQuestions = async () => {
        try {
            const response = await fetch("http://localhost:3001/admin/questions");
            const data = await response.json();
            setQuestions(data);
        } catch (err) {
            console.error("Error cargando preguntas:", err);
        }
    };

    // 2. MANEJAR CAMBIOS EN INPUTS DE OPCIONES
    const handleOptionChange = (index, value) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm({ ...form, options: newOptions });
    };

    // 3. GUARDAR O ACTUALIZAR (POST / PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = isEditing 
            ? `http://localhost:3001/admin/questions/${form.id}` 
            : "http://localhost:3001/admin/questions";
        
        const method = isEditing ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    module_id: form.module_id,
                    question_text: form.question_text,
                    correct_option: form.correct_option,
                    options_json: form.options // Enviamos el array directamente
                })
            });

            if (response.ok) {
                alert(isEditing ? "¡Actualizado!" : "¡Creado!");
                fetchQuestions();
                resetForm();
            }
        } catch (err) {
            console.error("Error al guardar:", err);
        }
    };

    // 4. ELIMINAR (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta pregunta?")) return;

        try {
            const response = await fetch(`http://localhost:3001/admin/questions/${id}`, { 
                method: "DELETE" 
            });
            if (response.ok) fetchQuestions();
        } catch (err) {
            console.error("Error al borrar:", err);
        }
    };

    // 5. PREPARAR EDICIÓN (DETECTA FORMATO JSON)
    const handleEdit = (q) => {
        setIsEditing(true);
        
        // Blindaje contra errores de formato:
        let parsedOptions = ["", "", ""];
        try {
            parsedOptions = typeof q.options_json === 'string' 
                ? JSON.parse(q.options_json) 
                : q.options_json;
        } catch (e) {
            console.error("Error al parsear opciones:", e);
        }

        setForm({
            id: q.id,
            module_id: q.module_id,
            question_text: q.question_text,
            options: Array.isArray(parsedOptions) ? parsedOptions : ["", "", ""],
            correct_option: q.correct_option
        });
    };

    const resetForm = () => {
        setForm({ id: null, module_id: 1, question_text: "", options: ["", "", ""], correct_option: 1 });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-10 font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ADMINISTRACIÓN</h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Base de Datos de Preguntas</p>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black animate-pulse">SERVIDOR: CONECTADO</div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* COLUMNA IZQUIERDA: FORMULARIO */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
                        <h2 className="text-lg font-black mb-6 flex items-center gap-2">
                            {isEditing ? "?? EDITAR" : "? NUEVA PREGUNTA"}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Módulo</label>
                                <select 
                                    className="w-full mt-1 p-3 bg-slate-50 border rounded-xl font-bold focus:ring-2 ring-blue-500 outline-none"
                                    value={form.module_id}
                                    onChange={(e) => setForm({...form, module_id: e.target.value})}
                                >
                                    <option value="1">Contraseñas</option>
                                    <option value="2">Phishing</option>
                                    <option value="3">Redes Sociales</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pregunta</label>
                                <textarea 
                                    className="w-full mt-1 p-3 bg-slate-50 border rounded-xl font-bold outline-none"
                                    value={form.question_text}
                                    onChange={(e) => setForm({...form, question_text: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Respuestas (Marca la correcta)</label>
                                {form.options.map((opt, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input 
                                            className="flex-1 p-2 bg-slate-50 border rounded-lg text-sm"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            required
                                        />
                                        <input 
                                            type="radio" 
                                            name="correct" 
                                            checked={form.correct_option === idx + 1}
                                            onChange={() => setForm({...form, correct_option: idx + 1})}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                                {isEditing ? "Guardar Cambios" : "Crear Pregunta"}
                            </button>
                            {isEditing && (
                                <button onClick={resetForm} type="button" className="w-full text-slate-400 font-bold text-xs uppercase">Cancelar</button>
                            )}
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: TABLA */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-slate-400 text-left">MOD</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 text-left">PREGUNTA</th>
                                    <th className="p-4 text-[10px] font-black text-slate-400 text-right">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {questions.map((q) => (
                                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4"><span className="font-black text-blue-600">#{q.module_id}</span></td>
                                        <td className="p-4 text-sm font-bold text-slate-600">{q.question_text}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button onClick={() => handleEdit(q)} className="text-blue-500 font-black text-[10px] uppercase">Editar</button>
                                            <button onClick={() => handleDelete(q.id)} className="text-red-400 font-black text-[10px] uppercase">Borrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
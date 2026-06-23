import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import ModuleInfo from "./pages/ModuleInfo";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Library from "./pages/Library";
import LibraryAdmin from "./pages/LibraryAdmin";
import QuestionsAdmin from "./pages/QuestionsAdmin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/module/:id" element={<ModuleInfo />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/library" element={<Library />} />
        
        {/* Rutas de Administrador */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/questions" element={<QuestionsAdmin />} />
        <Route path="/admin/library" element={<LibraryAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
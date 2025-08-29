import {Routes, Route, Navigate} from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import NotesPage from "./pages/NotesPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
 return (
  <div className="min-h-screen">
   <Navbar />
   <main className="py-6">
    <Routes>
     <Route
      path="/"
      element={
       <ProtectedRoute>
        <NotesPage />
       </ProtectedRoute>
      }
     />
     <Route path="/auth" element={<AuthPage />} />
     <Route path="*" element={<Navigate to="/" />} />
    </Routes>
   </main>
  </div>
 );
}

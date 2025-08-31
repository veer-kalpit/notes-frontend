import {Routes, Route, Navigate} from "react-router-dom";
// import Navbar from "./components/Navbar";
import AuthPage from "./pages/signIn";
import SignUp from "./pages/signUp";
import NotesPage from "./pages/NotesPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
 return (
  <div className="min-h-screen">
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
     <Route path="/signup" element={<SignUp />} />
     <Route path="*" element={<Navigate to="/" />} />
    </Routes>
   </main>
  </div>
 );
}

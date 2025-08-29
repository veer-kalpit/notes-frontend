// src/components/Navbar.tsx
import {Link, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {signOut} from "../firebaseClient";

export default function Navbar() {
 const {user} = useAuth();
 const navigate = useNavigate();

 const handleSignOut = async () => {
  await signOut();
  localStorage.removeItem("idToken");
  navigate("/auth");
 };

 return (
  <nav className="bg-white shadow-sm">
   <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
    <Link to="/" className="font-bold text-lg">
     Notes
    </Link>
    <div className="flex items-center gap-4">
     {user ? (
      <>
       <div className="text-sm text-slate-600 hidden sm:block">
        {user.email}
       </div>
       <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
       >
        Sign out
       </button>
      </>
     ) : (
      <Link
       to="/auth"
       className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
       Sign in
      </Link>
     )}
    </div>
   </div>
  </nav>
 );
}

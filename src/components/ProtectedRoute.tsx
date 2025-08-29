// src/components/ProtectedRoute.tsx
import {type ReactNode, useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebaseClient";
import {useNavigate} from "react-router-dom";

interface Props {
 children: ReactNode;
}

export default function ProtectedRoute({children}: Props) {
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 useEffect(() => {
  const unsub = onAuthStateChanged(auth, (u) => {
   if (!u) navigate("/auth");
   setLoading(false);
  });
  return () => unsub();
 }, [navigate]);

 if (loading) return <div className="text-center mt-10">Loading...</div>;
 return <>{children}</>;
}

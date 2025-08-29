// src/hooks/useAuth.ts
import {useEffect, useState} from "react";
import {type User, onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebaseClient";

export default function useAuth() {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (u) => {
   setUser(u);
   setLoading(false);
   if (u) {
    const token = await u.getIdToken();
    localStorage.setItem("idToken", token);
   } else {
    localStorage.removeItem("idToken");
   }
  });
  return () => unsub();
 }, []);

 return {user, loading};
}

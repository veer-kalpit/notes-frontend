// src/pages/AuthPage.tsx
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
 signInWithGoogle,
 sendMagicLinkToEmail,
 tryCompleteEmailSignIn,
} from "../firebaseClient";
import useAuth from "../hooks/useAuth";

import {loginWithGoogle} from "../services/api";

export default function AuthPage() {
 const {user, loading} = useAuth();
 const navigate = useNavigate();
 const [email, setEmail] = useState("");
 const [message, setMessage] = useState<string | null>(null);
 const [emailError, setEmailError] = useState<string | null>(null);

 useEffect(() => {
  (async () => {
   try {
    const res = await tryCompleteEmailSignIn();
    if (res) navigate("/");
   } catch (err: unknown) {
    if (err instanceof Error)
     setMessage(err.message || "Failed to complete sign-in");
    else setMessage("Failed to complete sign-in");
   }
  })();
 }, [navigate]);

 useEffect(() => {
  if (!loading && user) navigate("/");
 }, [loading, user, navigate]);

 const handleGoogle = async () => {
  try {
   const result = await signInWithGoogle();
   // Get idToken from Firebase user
   const user = result.user;
   const idToken = await user.getIdToken();
   // Send idToken to backend
   const backendRes = await loginWithGoogle(idToken);
   // Store token/user info for later API calls
   localStorage.setItem("idToken", idToken);
   localStorage.setItem("user", JSON.stringify(backendRes));
   navigate("/");
  } catch (err: unknown) {
   if (err instanceof Error) setMessage(err.message || "Google sign-in failed");
   else setMessage("Google sign-in failed");
  }
 };

 const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 };

 const handleSendMagic = async () => {
  setEmailError(null);
  setMessage(null);
  if (!validateEmail(email)) {
   setEmailError("Please enter a valid email address.");
   return;
  }
  try {
   await sendMagicLinkToEmail(email);
   setMessage("Magic link sent — check your inbox.");
  } catch (err: unknown) {
   if (err instanceof Error)
    setMessage(err.message || "Failed to send magic link");
   else setMessage("Failed to send magic link");
  }
 };

 return (
  <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
   <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-bold mb-4">Welcome to Notes!</h1>
    <div className="mb-4 text-slate-600 text-center">
     Sign up or log in to manage your notes.
    </div>
    <button
     onClick={handleGoogle}
     className="w-full border rounded py-2 flex items-center justify-center gap-2 mb-4 hover:bg-slate-50"
    >
     <img
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="google"
      className="w-5 h-5"
     />
     Sign in with Google
    </button>
    <div className="my-2 text-center text-slate-400">OR</div>
    <label className="block text-sm font-medium text-slate-700">
     Email (magic link)
    </label>
    <div className="flex gap-2 mt-2">
     <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="flex-1 border rounded px-3 py-2"
      placeholder="you@example.com"
      type="email"
     />
     <button
      onClick={handleSendMagic}
      className="bg-blue-600 text-white px-4 rounded"
     >
      Send
     </button>
    </div>
    {emailError && (
     <div className="text-red-500 text-xs mt-1">{emailError}</div>
    )}
    {message && <div className="mt-4 text-sm text-slate-600">{message}</div>}
   </div>
  </div>
 );
}

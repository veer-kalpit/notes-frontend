import {initializeApp} from "firebase/app";
import {
 getAuth,
 GoogleAuthProvider,
 signInWithPopup,
 sendSignInLinkToEmail,
 isSignInWithEmailLink,
 signInWithEmailLink,
 signOut as fbSignOut,
} from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyCSsQsHtDJ4DVMCY4RZAXj5N4oa24zDIS0",
 authDomain: "notes-bc6bc.firebaseapp.com",
 projectId: "notes-bc6bc",
 storageBucket: "notes-bc6bc.firebasestorage.app",
 messagingSenderId: "635240052886",
 appId: "1:635240052886:web:8171ffae0b0b2a60aa6ab7",
 measurementId: "G-PDGG1RRTNG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google popup
 */
export const signInWithGoogle = async () => {
 return await signInWithPopup(auth, googleProvider);
};

/**
 * Send Email Link (magic link) to email
 * Firebase Console > Authentication > Sign-in method: enable Email link (passwordless)
 * Make sure authorized domain includes your origin
 */
export const sendMagicLinkToEmail = async (email: string) => {
 const actionCodeSettings = {
  url: window.location.origin + "/auth",
  handleCodeInApp: true,
 };
 await sendSignInLinkToEmail(auth, email, actionCodeSettings);
 window.localStorage.setItem("emailForSignIn", email);
};


export const tryCompleteEmailSignIn = async () => {
 if (isSignInWithEmailLink(auth, window.location.href)) {
  const email =
   window.localStorage.getItem("emailForSignIn") ||
   window.prompt("Please provide your email for confirmation");
  if (!email) throw new Error("No email available to complete sign-in");
  const result = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem("emailForSignIn");
  return result;
 }
 return null;
};

export const signOut = async () => {
 await fbSignOut(auth);
};

export default app;

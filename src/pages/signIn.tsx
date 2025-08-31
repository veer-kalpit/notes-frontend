import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {login, requestOtp, loginWithOtp} from "../services/api";

const SignIn = () => {
 const [showPassword, setShowPassword] = useState(false);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [otp, setOtp] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const [step, setStep] = useState<"email" | "choose" | "password" | "otp">(
  "email"
 );
 const [otpSent, setOtpSent] = useState(false);
 const [otpLoading, setOtpLoading] = useState(false);
 const navigate = useNavigate();

 return (
  <div className="flex h-screen bg-white">
   <div className="flex flex-col flex-1 justify-center px-6 sm:px-12 md:px-24">
    <div className="absolute top-6 left-6 flex items-center gap-2">
     <div className="w-8 h-8 rounded-full">
      <img src="/logo.png" alt="logo" />
     </div>
     <span className="font-semibold text-[24px]">HD</span>
    </div>

    <div className="flex flex-col items-start w-full max-w-sm mx-auto">
     <h1 className="text-[40px] text-[#232323] font-bold mb-3 text-left">
      Sign in
     </h1>
     <p className="text-[#969696] mb-10 text-lg text-left">
      Please login to continue to your account.
     </p>

     <form
      className="space-y-5 w-full"
      onSubmit={async (e) => {
       e.preventDefault();
       setError("");
       if (step === "password") {
        setLoading(true);
        try {
         const res = await login({email, password});
         if (res?.success) {
          localStorage.setItem("token", res.token);
          if (res.name) localStorage.setItem("name", res.name);
          if (res.email) localStorage.setItem("email", res.email);
          navigate("/");
         } else {
          setError(res?.message || "Invalid credentials");
         }
        } catch (err) {
         const errorMsg =
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as {response?: {data?: {message?: string}}}).response?.data
           ?.message
           ? (err as {response?: {data?: {message?: string}}}).response?.data
              ?.message
           : "Something went wrong";
         setError(errorMsg || "Something went wrong");
        } finally {
         setLoading(false);
        }
       } else if (step === "otp") {
        setLoading(true);
        try {
         const res = await loginWithOtp({email, otp});
         if (res?.success) {
          localStorage.setItem("token", res.token);
          if (res.name) localStorage.setItem("name", res.name);
          if (res.email) localStorage.setItem("email", res.email);
          navigate("/");
         } else {
          setError(res?.message || "Invalid OTP");
         }
        } catch (err) {
         const errorMsg =
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as {response?: {data?: {message?: string}}}).response?.data
           ?.message
           ? (err as {response?: {data?: {message?: string}}}).response?.data
              ?.message
           : "Something went wrong";
         setError(errorMsg || "Something went wrong");
        } finally {
         setLoading(false);
        }
       }
      }}
     >
      {step === "email" && (
       <>
        <div className="relative">
         <label
          htmlFor="email"
          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#367AFF]"
         >
          Email
         </label>
         <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#367AFF] rounded-xl px-4 py-3 bg-transparent text-black"
          required
         />
        </div>
        <button
         type="button"
         className="w-full bg-[#367AFF] text-white py-3 rounded-xl font-semibold flex items-center justify-center mt-2"
         disabled={!email}
         onClick={() => setStep("choose")}
        >
         Continue
        </button>
       </>
      )}

      {step === "choose" && (
       <>
        <div className="w-full flex flex-col gap-3">
         <button
          type="button"
          className="w-full bg-[#367AFF] text-white py-3 rounded-xl font-semibold"
          onClick={() => setStep("password")}
         >
          Sign in with Password
         </button>
         <button
          type="button"
          className="w-full bg-[#232323] text-white py-3 rounded-xl font-semibold"
          disabled={otpLoading}
          onClick={async () => {
           setOtpLoading(true);
           setError("");
           try {
            const res = await requestOtp({email});
            if (res?.success) {
             setOtpSent(true);
             setStep("otp");
            } else {
             setError(res?.message || "Failed to send OTP");
            }
           } catch (err) {
            const errorMsg =
             err &&
             typeof err === "object" &&
             "response" in err &&
             (err as {response?: {data?: {message?: string}}}).response?.data
              ?.message
              ? (err as {response?: {data?: {message?: string}}}).response?.data
                 ?.message
              : "Something went wrong";
            setError(errorMsg || "Something went wrong");
           } finally {
            setOtpLoading(false);
           }
          }}
         >
          {otpLoading ? "Sending OTP..." : "Sign in with OTP"}
         </button>
        </div>
       </>
      )}

      {step === "password" && (
       <>
        <div className="relative">
         <label
          htmlFor="password"
          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500"
         >
          Password
         </label>
         <div className="w-full border border-gray-300 rounded-xl px-4 py-3 flex items-center">
          <input
           id="password"
           type={showPassword ? "text" : "password"}
           placeholder="Enter your password"
           className="w-full bg-transparent text-black focus:outline-none"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required
          />
          <button
           type="button"
           onClick={() => setShowPassword(!showPassword)}
           className="ml-2 text-gray-500"
          >
           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
         </div>
        </div>
        <button
         type="submit"
         className="w-full bg-[#367AFF] text-white py-3 rounded-xl font-semibold flex items-center justify-center"
         disabled={loading}
        >
         {loading ? (
          <>
           <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
           >
            <circle
             className="opacity-25"
             cx="12"
             cy="12"
             r="10"
             stroke="currentColor"
             strokeWidth="4"
            ></circle>
            <path
             className="opacity-75"
             fill="currentColor"
             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
           </svg>
           Loading...
          </>
         ) : (
          "Sign in"
         )}
        </button>
        <button
         type="button"
         className="w-full text-[#367AFF] mt-2"
         onClick={() => setStep("choose")}
        >
         Back
        </button>
       </>
      )}

      {step === "otp" && (
       <>
        <div className="relative">
         <label
          htmlFor="otp"
          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#367AFF]"
         >
          OTP
         </label>
         <input
          id="otp"
          type="text"
          placeholder="Enter OTP sent to your email"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-[#367AFF] rounded-xl px-4 py-3 bg-transparent text-black"
          required
          maxLength={8}
         />
        </div>
        <button
         type="submit"
         className="w-full bg-[#367AFF] text-white py-3 rounded-xl font-semibold flex items-center justify-center"
         disabled={loading}
        >
         {loading ? (
          <>
           <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
           >
            <circle
             className="opacity-25"
             cx="12"
             cy="12"
             r="10"
             stroke="currentColor"
             strokeWidth="4"
            ></circle>
            <path
             className="opacity-75"
             fill="currentColor"
             d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
           </svg>
           Logging in...
          </>
         ) : (
          "Sign in with OTP"
         )}
        </button>
        <button
         type="button"
         className="w-full text-[#367AFF] mt-2"
         onClick={() => setStep("choose")}
        >
         Back
        </button>
        {otpSent && (
         <p className="text-green-600 text-sm mt-2">OTP sent to your email.</p>
        )}
       </>
      )}

      {error && <p className="text-red-500 text-sm text-left">{error}</p>}
     </form>
    </div>

    <p className="mt-10 text-sm text-gray-600 text-center">
     Need an account?{" "}
     <Link to="/signup" className="text-blue-500 font-medium">
      Create one
     </Link>
    </p>
   </div>

   <div className="hidden md:flex w-1/2 p-8">
    <img
     src="/container.png"
     alt="Background"
     className="w-full h-full rounded-3xl object-cover"
    />
   </div>
  </div>
 );
};

export default SignIn;

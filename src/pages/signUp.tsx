import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {register, verifyEmail} from "../services/api";

const SignUp = () => {
 const [showOtp, setShowOtp] = useState(false);
 const [otpSent, setOtpSent] = useState(false);
 const [name, setName] = useState("");
 //  const [dob, setDob] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [otp, setOtp] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
   if (!otpSent) {
    await register({name, email, password});
    setOtpSent(true);
   } else {
    const res = await verifyEmail({email, code: otp});
    if (res?.success) {
     navigate("/auth");
    } else {
     setError(res?.message || "Invalid OTP");
    }
   }
  } catch (err) {
   const errorMsg =
    err &&
    typeof err === "object" &&
    "response" in err &&
    (err as {response?: {data?: {message?: string}}}).response?.data?.message
     ? (err as {response?: {data?: {message?: string}}}).response?.data?.message
     : "Something went wrong";
   setError(errorMsg || "Something went wrong");
  } finally {
   setLoading(false);
  }
 };

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
     <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-left">Sign up</h1>
     <p className="text-gray-500 mb-10 text-base sm:text-lg text-left">
      Sign up to enjoy the feature of HD
     </p>

     <form className="space-y-5 w-full" onSubmit={handleSubmit}>
      <div className="relative">
       <label
        htmlFor="name"
        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500"
       >
        Your Name
       </label>
       <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-transparent text-black"
        disabled={otpSent}
       />
      </div>

      {/* <div className="relative">
       <label
        htmlFor="dob"
        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500"
       >
        Date of Birth
       </label>
       <div className="w-full border border-gray-300 rounded-xl px-4 py-3 flex items-center">
        <Calendar className="w-5 h-5 text-gray-500 mr-3" />
        <input
         id="dob"
         type="text"
         value={dob}
         onChange={(e) => setDob(e.target.value)}
         className="w-full bg-transparent text-black focus:outline-none"
         disabled={otpSent}
        />
       </div>
      </div> */}

      <div className="relative">
       <label
        htmlFor="email"
        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500"
       >
        Email
       </label>
       <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-transparent text-black"
        disabled={otpSent}
       />
      </div>

      <div className="relative">
       <label
        htmlFor="password"
        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500"
       >
        Password
       </label>
       <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-transparent text-black"
        disabled={otpSent}
       />
      </div>

      {otpSent && (
       <div className="relative">
        <label
         htmlFor="otp"
         className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500"
        >
         OTP
        </label>
        <div className="w-full border border-gray-300 rounded-xl px-4 py-3 flex items-center">
         <input
          id="otp"
          type={showOtp ? "text" : "password"}
          placeholder="Enter OTP"
          className="w-full bg-transparent text-black focus:outline-none"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
         />
         <button
          type="button"
          onClick={() => setShowOtp(!showOtp)}
          className="ml-2 text-gray-500"
         >
          {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
         </button>
        </div>
       </div>
      )}

      {error && <p className="text-red-500 text-sm text-left">{error}</p>}

      <button
       type="submit"
       className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center"
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
       ) : otpSent ? (
        "Sign up"
       ) : (
        "Get OTP"
       )}
      </button>
     </form>
    </div>

    <p className="mt-10 text-sm text-gray-600 text-center">
     Already have an account?{" "}
     <Link to="/auth" className="text-blue-500 font-medium">
      Sign in
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

export default SignUp;

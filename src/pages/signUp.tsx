import {useState} from "react";
import {Eye, EyeOff, Calendar} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {register, verifyEmail} from "../services/api";

const SignUp = () => {
 const [showOtp, setShowOtp] = useState(false);
 const [otpSent, setOtpSent] = useState(false);
 const [name, setName] = useState("");
 const [dob, setDob] = useState("");
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
    // Step 1: Register user and send OTP
    await register({name, email, password});
    setOtpSent(true);
   } else {
    // Step 2: Verify OTP
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
  <div className="flex h-screen bg-white p-8 justify-center">
   {/* Left Section */}
   <div className="flex flex-col  w-[591px] justify-center">
    {/* Logo */}
    <div className="flex items-center gap-2 mb-10">
     <div className="w-6 h-6 rounded-full border-4 border-blue-500 animate-spin"></div>
     <span className="font-semibold text-lg">HD</span>
    </div>

    {/* Title */}
    <h1 className="text-[40px] font-bold mb-3 text-left px-[96px]">Sign up</h1>
    <p className="text-[#969696] mb-10 text-[18px] text-left px-[96px]">
     Sign up to enjoy the feature of HD
    </p>

    {/* Form */}
    <form className="w-[399px] space-y-5 px-[96px]" onSubmit={handleSubmit}>
     {/* Name */}
     <div className="relative">
      <label
       htmlFor="name"
       className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#9A9A9A]"
      >
       Your Name
      </label>
      <input
       id="name"
       type="text"
       value={name}
       onChange={(e) => setName(e.target.value)}
       className="w-[399px] border border-[#D9D9D9] rounded-xl px-4 py-3 bg-transparent text-black"
       disabled={otpSent}
      />
     </div>
     {/* Date of Birth */}
     <div className="relative">
      <label
       htmlFor="dob"
       className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#9A9A9A]"
      >
       Date of Birth
      </label>
      <div className="w-[399px] border border-[#D9D9D9] rounded-xl px-4 py-3 flex items-center">
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
     </div>
     <div className="relative">
      <label
       htmlFor="password"
       className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#9A9A9A]"
      >
       Password
      </label>
      <input
       id="password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       className="w-[399px] border border-[#D9D9D9] rounded-xl px-4 py-3 bg-transparent text-black"
       disabled={otpSent}
      />
     </div>
     {/* Email */}
     <div className="relative">
      <label
       htmlFor="email"
       className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#9A9A9A]"
      >
       Email
      </label>
      <input
       id="email"
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className="w-[399px] border border-[#D9D9D9] rounded-xl px-4 py-3 bg-transparent text-black"
       disabled={otpSent}
      />
     </div>
     {/* Conditionally show OTP Input */}
     {otpSent && (
      <div className="relative">
       <label
        htmlFor="otp"
        className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#9A9A9A]"
       >
        OTP
       </label>
       <div className="w-[399px] border border-[#D9D9D9] rounded-xl px-4 py-3 flex items-center">
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
     {/* Error */}
     {error && <p className="text-red-500 text-sm">{error}</p>}
     {/* Button */}
     <button
      type="submit"
      className="w-[399px] bg-blue-600 text-white py-3 rounded-xl font-semibold"
      disabled={loading}
     >
      {otpSent ? "Sign up" : "Get OTP"}
     </button>
    </form>

    {/* Footer */}
    <p className="mt-6 text-sm text-gray-600 text-center">
     Already have an account?{" "}
     <Link to="/auth" className="text-blue-500 font-medium">
      Sign in
     </Link>
    </p>
   </div>

   {/* Right Section */}
   <div className="w-[849px] rounded-3xl flex p-8">
    <img src="/container.png" alt="Background" className="w-full h-full" />
   </div>
  </div>
 );
};

export default SignUp;

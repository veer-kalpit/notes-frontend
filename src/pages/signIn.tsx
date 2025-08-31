import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {login} from "../services/api";

const SignIn = () => {
 const [showPassword, setShowPassword] = useState(false);
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");
 const navigate = useNavigate();

 return (
  <div className="flex h-screen bg-white p-8 justify-center">
   <div className="flex flex-col w-[591px] justify-center">
    <div className="flex items-center gap-2 mb-10">
     <div className="w-6 h-6 rounded-full border-4 border-blue-500 animate-spin"></div>
     <span className="font-semibold text-lg">HD</span>
    </div>

    <h1 className="text-[40px] font-bold mb-3 text-left px-[96px]">Sign in</h1>
    <p className="text-[#969696] mb-10 text-[18px] text-left px-[96px]">
     Please login to continue to your account.
    </p>

    {/* Form */}
    <form
     className="w-[399px] space-y-5 px-[96px]"
     onSubmit={async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
       const res = await login({email, password});
       if (res?.success) {
        localStorage.setItem("Idtoken", res.token);
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
     }}
    >
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
      />
     </div>

     {/* Password */}
     <div className="relative">
      <label
       htmlFor="password"
       className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-[#9A9A9A]"
      >
       Password
      </label>
      <div className="w-[399px] border border-[#D9D9D9] rounded-xl px-4 py-3 flex items-center">
       <input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        className="w-full bg-transparent text-black focus:outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

     {/* Error */}
     {error && <p className="text-red-500 text-sm">{error}</p>}

     {/* Button */}
     <button
      type="submit"
      className="w-[399px] bg-blue-600 text-white py-3 rounded-xl font-semibold"
      disabled={loading}
     >
      Sign in
     </button>
    </form>

    {/* Footer */}
    <p className="mt-6 text-sm text-gray-600 text-center">
     Need an account?{" "}
     <Link to="/signup" className="text-blue-500 font-medium">
      Create one
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

export default SignIn;

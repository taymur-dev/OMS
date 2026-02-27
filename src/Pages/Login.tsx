import axios, { AxiosError } from "axios";
import { InputField } from "../Components/InputFields/InputField";
import { useEffect, useState } from "react";
import Logo from "../assets/techmen.png";
import BackgroundImg from "../assets/officepic.jpg";
import { BASE_URL } from "../Content/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { authSuccess, authFailure } from "../redux/UserSlice";
import setAuthToken from "../SetAuthToken";
import { Navigate } from "react-router-dom";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

// Icons
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Login | OMS";
    dispatch(navigationStart());
    dispatch(navigationSuccess("logIn"));
  }, [dispatch]);

  if (currentUser?.role === "admin") return <Navigate to="/" />;
  if (currentUser?.role === "user") return <Navigate to="/User/dashboard" />;

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/login`, formData);
      const { token } = res.data;
      setAuthToken(token);
      dispatch(authSuccess(res.data));
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      dispatch(authFailure(axiosError.response?.data?.message ?? ""));
      toast.error(axiosError.response?.data?.message ?? "");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(39, 39, 39, 0.7), rgba(27, 27, 27, 0.5)), url(${BackgroundImg})`,
      }}
    >
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
        />
      </div>

      <div
        className="relative z-10 w-full max-w-[440px] bg-gray-100 backdrop-blur-xl rounded-[40px]
        border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 text-center animate-[fadeIn_0.5s_ease-out]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-full h-14  flex items-center justify-center overflow-hidden ">
            <img
              src={Logo}
              alt="Technic Mentors"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Login to your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiMail size={18} />
            </div>
            <InputField
              type="email"
              placeHolder="Email"
              name="email"
              handlerChange={handlerChange}
              value={formData.email}
              icon={<FiMail size={18} />}
              className="h-12 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FiLock size={18} />
            </div>
            <InputField
              type={showPassword ? "text" : "password"}
              placeHolder="Password"
              name="password"
              handlerChange={handlerChange}
              value={formData.password}
              icon={<FiLock size={18} />}
              className="w-full h-12 pl-12 pr-12 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-blue-400
                transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-medium text-gray-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full h-14 bg-blue-400 hover:bg-[#5198f6] text-white font-semibold rounded-2xl
              shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Get Started"}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 border-dashed"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-transparent px-2 text-gray-400">
              Or sign in with
            </span>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <button
            className="flex-1 h-12 flex items-center justify-center bg-white rounded-xl border border-gray-100
            shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FcGoogle size={20} />
          </button>
          <button
            className="flex-1 h-12 flex items-center justify-center bg-white rounded-xl border border-gray-100
            shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FaFacebook className="text-[#1877F2]" size={20} />
          </button>
          <button
            className="flex-1 h-12 flex items-center justify-center bg-white rounded-xl border border-gray-100
            shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FaApple className="text-black" size={20} />
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

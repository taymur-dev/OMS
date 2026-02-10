import axios, { AxiosError } from "axios";
import { InputField } from "../Components/InputFields/InputField";
import technic from "../assets/technic.png";
import Logo from "../assets/Logo.png";

import { useEffect, useState } from "react";
import { BASE_URL } from "../Content/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { authFailure, authSuccess } from "../redux/UserSlice";
import setAuthToken from "../SetAuthToken";
import { Navigate } from "react-router-dom";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import SplashAnimation from "../assets/login-splash.json";

import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const { currentUser, error } = useAppSelector((state) => state.officeState);
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "(OMS) Login";
    dispatch(navigationStart());

    const timer = setTimeout(() => {
      dispatch(navigationSuccess("logIn"));
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (currentUser?.role === "admin") return <Navigate to="/" />;
  if (currentUser?.role === "user") return <Navigate to="/User/dashboard" />;

  if (showSplash) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900
       to-indigo-900 relative"
      >
        <div className="w-72 relative">
          <Lottie animationData={SplashAnimation} loop={false} />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={Logo}
              alt="Logo"
              className="w-24 h-24 object-contain animate-[pulse_2s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>
    );
  }

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
    setFormData(initialState);
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br
     from-indigo-500 via-indigo-900 to-indigo-600"
    >
      <div className="absolute -bottom-10 -left-16 w-60 h-60 bg-slate-200/20 rounded-full
       animate-[float_2s_ease-in-out_infinite] delay-1000 animate-pulse blur-1xl" />

      <div className="absolute -top-10 -right-16 w-60 h-60 bg-slate-200/20 rounded-full
       animate-[float_2s_ease-in-out_infinite] delay-1000 blur-1xl" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10
       animate-[fadeIn_0.6s_ease-out]">
        <div className="flex flex-col items-center  justify-center">
          <div className="relative mb-4">
            <div
              className="relative w-32 h-32 rounded-full bg-indigo-900 flex items-center
             justify-center shadow-xl animate-[float_3s_ease-in-out_infinite]"
            >
              <div className="absolute inset-0 rounded-full bg-indigo-900/30 blur-3xl 
              animate-[pulse_2s_ease-in-out_infinite]" />
              <img
                src={technic}
                alt="Logo"
                className="relative w-20 h-20 object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative focus-within:text-blue-500">
            <InputField
              type="email"
              labelName="Email"
              name="email"
              handlerChange={handlerChange}
              value={formData.email}
              className="pl-10 pr-10 border border-gray-300 focus:border-indigo-900 focus:outline-none 
              rounded-lg w-full h-12"
            />
            <div className="absolute inset-y-0 top-3 left-0 flex items-center pl-3 pointer-events-none">
              <FiMail className="w-5 h-5" />
            </div>
          </div>

          <div className="relative focus-within:text-blue-500">
            <InputField
              type={showPassword ? "text" : "password"}
              labelName="Password"
              name="password"
              handlerChange={handlerChange}
              value={formData.password}
              className="pl-10 pr-10 border border-gray-300 focus:border-blue-500 focus:outline-none
               rounded-lg w-full h-12"
            />
            <div className="absolute inset-y-0 top-3 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-5 h-5" />
            </div>
            <div
              className="absolute inset-y-0 top-3 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full h-12 rounded-lg bg-indigo-900 text-white font-semibold tracking-wide transition-all
       duration-300 hover:bg-indigo-900 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span>Logging in...</span>
              </div>
            ) : (
              "LOGIN"
            )}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center pt-1">{error}</p>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Technic Mentors — OMS
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
};

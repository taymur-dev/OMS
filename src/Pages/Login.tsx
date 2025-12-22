import axios, { AxiosError } from "axios";
import { InputField } from "../Components/InputFields/InputField";
import Logo from "../assets/Logo.png";
import officeTeam from "../assets/OMS.jpg";
import { useEffect, useState } from "react";
import { BASE_URL } from "../Content/URL";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { authFailure, authSuccess } from "../redux/UserSlice";
import setAuthToken from "../SetAuthToken";
import { ClipLoader } from "react-spinners";
import { Navigate } from "react-router-dom";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loader } from "../Components/LoaderComponent/Loader";
import { toast } from "react-toastify";

const initialState = {
  email: "",
  password: "",
};
export const Login = () => {
  const { currentUser, error } = useAppSelector((state) => state.officeState);

  const { loader } = useAppSelector((state) => state.NavigateSate);

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  console.log("loading btn", loading);

  useEffect(() => {
    document.title = "(OMS)Login";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("logIn"));
    }, 1000);
  }, [dispatch]);

  if (currentUser?.role === "admin") return <Navigate to={"/"} />;
  if (currentUser?.role === "user") return <Navigate to={"/User/dashboard"} />;

  if (loader) return <Loader />;

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
    <div>
      <div className=" bg-indigo-500 flex items-center justify-between  ">
        <div className="p-8 pl-12">
          <img src={Logo} alt="Logo" className="w-44" />
          <h1 className="text-5xl text-white font-serif">Login to</h1>
          <h2 className="text-2xl text-white font-serif">
            Technic Mentors (Office Management System)
          </h2>
          <p className="text-white font-serif">
            The Office Management System (OMS) is an integrated software
            platform designed to streamline and automate daily office
            operations.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="shadow bg-white p-6 h-96 w-[28rem] absolute right-24 top-52 rounded-lg text-black  "
        >
          <h2 className="text-2xl font-serif ">
            Welcome to <span className="font-semibold ">Technic Mentors</span>
            (OMS)
          </h2>
          <h1 className="text-5xl font-serif">Login now</h1>
          <InputField
            type="email"
            labelName="Enter your Email"
            placeHolder="Abc@gmail.com..."
            name={"email"}
            handlerChange={handlerChange}
            inputVal={formData.email}
          />
          <InputField
            type="password"
            labelName="Enter your Password"
            placeHolder="Password..."
            name={"password"}
            handlerChange={handlerChange}
            inputVal={formData.password}
          />

          <button
            disabled={loading}
            className="w-full font-serif border rounded-md p-2 bg-indigo-500 text-white cursor-pointer mt-4 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span>Logging in...</span>
                <ClipLoader size={18} color="white" />
              </div>
            ) : (
              "Log In"
            )}
          </button>
          {error && (
            <p className="text-xs text-red-500 text-center pt-3">{error}</p>
          )}
        </form>
      </div>
      <img src={officeTeam} alt="office Team" className="h-[24rem] pl-20" />
    </div>
  );
};

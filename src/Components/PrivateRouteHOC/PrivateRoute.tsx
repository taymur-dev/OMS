import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/Hooks";

export const PrivateRoute = () => {
  const { currentUser } = useAppSelector((state) => state?.officeState);

  return currentUser ? <Outlet /> : <Navigate to={"/login"} />;
};


// import { Navigate, Outlet } from "react-router-dom";
// import { useAppSelector } from "../../redux/Hooks";

// export const PrivateRoute = () => {
//   const { currentUser } = useAppSelector((state) => state?.officeState);
//   console.log("currentUser =>", currentUser);
//   return currentUser && currentUser?.role === "user" ? <Outlet /> : <Navigate to={"/login"} />;
// };

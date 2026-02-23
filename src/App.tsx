import {
  BrowserRouter as Routers,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./Pages/Login";
import { AdminDashboard } from "./Pages/AdminDashboard";
import { UserDashboard } from "./Pages/UserDashboard";
import { PrivateLayout } from "./Components/HOC/PrivateLayout/PrivateLayout";
import { People } from "./Pages/AdminPage/People";
import { AttendanceHub } from "./Pages/AdminPage/AttendanceHub";
import { UserAttendanceHub } from "./Pages/AdminPage/UserAttendanceHub";
import { UserLeave } from "./Pages/AdminPage/UserLeave";
import { UserTodo } from "./Pages/AdminPage/UserTodo";
import { UserProgress } from "./Pages/AdminPage/UserProgress";

import { Assemble } from "./Pages/AdminPage/Assemble";
import { HumanResources } from "./Pages/AdminPage/HumanResources";
import { Projects } from "./Pages/AdminPage/Projects";

import { PerformanceHub } from "./Pages/AdminPage/PerformanceHub";
import { SalesHub } from "./Pages/AdminPage/SalesHub";
import { Payments } from "./Pages/AdminPage/Payments";
import { Expenditures } from "./Pages/AdminPage/Expenditures";
import { Wages } from "./Pages/AdminPage/Wages";
import { Summary } from "./Pages/AdminPage/Summary";

import { Profile } from "./Pages/AdminPage/Profile";
import { PrivateRoute } from "./Components/PrivateRouteHOC/PrivateRoute";
import { EmployeePrivateLayout } from "./Components/HOC/PrivateLayout/EmployeePrivateLayout";
import { EmployeeDashboard } from "./Components/Employee/EmployeeDashboard";

import { TalentAcquisition } from "./Pages/AdminPage/TalentAcquisition";

import { Propulsive } from "./Pages/AdminPage/Propulsive";

import { EmployeeProfile } from "./Pages/AdminPage/EmployeeProfile";
import { Capital } from "./Pages/AdminPage/Capital";

import { Ledgers } from "./Pages/AdminPage/Ledgers";

import { useAppSelector } from "./redux/Hooks";
import { UserAssignedProjects } from "./Pages/AdminPage/UserAssignedProjects";
import { UserPropulsive } from "./Pages/AdminPage/UserPropulsive";
import { UserSalary } from "./Pages/AdminPage/UserSalary";
import { UserPayroll } from "./Pages/AdminPage/UserPayroll";
import { UserReports } from "./Pages/AdminPage/UserReports";



function App() {
  const { currentUser } = useAppSelector((state) => state?.officeState);
  return (
    <Routers>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route
            element={
              currentUser?.role === "admin" ? (
                <PrivateLayout />
              ) : (
                <Navigate to="/User/dashboard" />
              )
            }
          >
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/people" element={<People />} />
            <Route path="/human-resources" element={<HumanResources />} />
            <Route path="/dynamics" element={<Propulsive />} />

            <Route path="/attendance" element={<AttendanceHub />} />
            <Route path="/assets" element={<Capital />} />
            <Route path="/accounts" element={<Ledgers />} />

            <Route path="/configuration" element={<Assemble />} />
            <Route path="/projects" element={<Projects />} />

            <Route path="/performance" element={<PerformanceHub />} />
            <Route path="/sales" element={<SalesHub />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenditures />} />
            <Route path="/payroll" element={<Wages />} />

            <Route path="/talent-acquisition" element={<TalentAcquisition />} />

            <Route path="/reports" element={<Summary />} />
            

            <Route
              path="/User/dashboard-admin-view"
              element={<UserDashboard />}
            />
          </Route>

          <Route
            element={
              currentUser?.role === "user" ? (
                <EmployeePrivateLayout />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route path="/User/dashboard" element={<EmployeeDashboard />} />
            <Route path="/user/profile" element={<EmployeeProfile />} />
            <Route path="/users/attendance" element={<UserAttendanceHub />} />
            <Route path="/users/leaveRequests" element={<UserLeave />} />
            <Route path="/user/dynamics" element={<UserPropulsive />} />

            <Route
              path="/users/assignedprojects"
              element={<UserAssignedProjects />}
            />
            <Route path="/users/todo" element={<UserTodo />} />
            <Route path="/users/progress" element={<UserProgress />} />
            <Route path="/user/payroll" element={<UserPayroll />} />
            <Route path="/user/salarydetail" element={<UserSalary />} />
            
             <Route
              path="/user/reports"
              element={<UserReports />}
            />
          
          </Route>
        </Route>
      </Routes>
    </Routers>
  );
}

export default App;

import { BrowserRouter as Routers, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./Pages/Login";
import { AdminDashboard } from "./Pages/AdminDashboard";
import { UserDashboard } from "./Pages/UserDashboard";
import { PrivateLayout } from "./Components/HOC/PrivateLayout/PrivateLayout";
import { UsersDetails } from "./Pages/AdminPage/UsersDetails";
import { CustomerDetail } from "./Pages/AdminPage/CustomerDetail";
import { MarkAttendance } from "./Pages/AdminPage/MarkAttendance";
import { UserAttendance } from "./Pages/AdminPage/UserAttendance";
import { LeaveRequests } from "./Pages/AdminPage/LeaveRequests";
import { Holidays } from "./Pages/AdminPage/Holidays";
import { EmployeeWithdraw } from "./Pages/AdminPage/EmployeeWithdraw";
import { ProjectsDetails } from "./Pages/AdminPage/ProjectsDetails";
import { ProjectsCatogries } from "./Pages/ProjectsCategories";
import { AssignProjects } from "./Pages/AdminPage/AssignProjects";
import { Todo } from "./Pages/AdminPage/Todo";
import { Progress } from "./Pages/Progress";
import { Sales } from "./Pages/AdminPage/Sales";
import { Quotation } from "./Pages/AdminPage/Quotation";
import { Payments } from "./Pages/AdminPage/Payments";
import { Expenses } from "./Pages/AdminPage/Expenses";
import { ExpensesCatogries } from "./Pages/AdminPage/ExpensesCatogries";
import { Calendar } from "./Pages/AdminPage/Calendar";
import { SalaryCycle } from "./Pages/AdminPage/SalaryCycle";
import { ConfigEmpSalary } from "./Pages/AdminPage/ConfigEmpSalary";
import { EmployeeAccount } from "./Pages/AdminPage/EmployeeAccount";
import { SalesReports } from "./Pages/AdminPage/SalesReports";
import { ProgressReports } from "./Pages/AdminPage/ProgressReports";
import { AttendanceReports } from "./Pages/AdminPage/AttendanceReports";
import { ProcessReports } from "./Pages/AdminPage/ProcessReports";
import { PaymentsReports } from "./Pages/AdminPage/PaymentsReports";
import { ExpenseReports } from "./Pages/AdminPage/ExpenseReports";
import { Profile } from "./Pages/AdminPage/Profile";
import { PrivateRoute } from "./Components/PrivateRouteHOC/PrivateRoute";
import { EmployeePrivateLayout } from "./Components/HOC/PrivateLayout/EmployeePrivateLayout";
import { EmployeeDashboard } from "./Components/Employee/EmployeeDashboard";
import { Loan } from "./Pages/AdminPage/Loan";
import { AdvanceSalary } from "./Pages/AdminPage/AdvanceSalary";
import { OverTime } from "./Pages/AdminPage/OverTime";
import { Applicants } from "./Pages/AdminPage/Applicants";
import { Jobs } from "./Pages/AdminPage/Jobs";
import { EmployeeLifeline } from "./Pages/AdminPage/EmployeeLifeline";
import { Promotion } from "./Pages/AdminPage/Promotion";
import { Resignation } from "./Pages/AdminPage/Resignation";
import { Rejoin } from "./Pages/AdminPage/Rejoin";
import { EmployeeProfile } from "./Pages/AdminPage/EmployeeProfile";
import { AssetCategory } from "./Pages/AdminPage/AssetCategory";
import { Assets } from "./Pages/AdminPage/Assets";
import { Suppliers } from "./Pages/AdminPage/Suppliers";

import { CustomerAccount } from "./Pages/AdminPage/CustomerAccount";
import { SupplierAccount } from "./Pages/AdminPage/SupplierAccount";
import { AttendanceRule } from "./Pages/AdminPage/AttendanceRule";

import { useAppSelector } from "./redux/Hooks";

function App() {

  const { currentUser } = useAppSelector((state) => state?.officeState);
  return (
    <Routers>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          
         <Route element={currentUser?.role === 'admin' ? <PrivateLayout /> : <Navigate to="/User/dashboard" />}>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UsersDetails />} />
            <Route path="/customers" element={<CustomerDetail />} />
            <Route path="/employeeLifeline" element={<EmployeeLifeline />} />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/resignation" element={<Resignation />} />
            <Route path="/rejoin" element={<Rejoin />} />
            <Route path="/markAttendance" element={<MarkAttendance />} />
            <Route path="/assetsCategory" element={<AssetCategory />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/supplier" element={<Suppliers />} />
            <Route path="/customerAccount" element={<CustomerAccount />} />
            <Route path="/supplierAccount" element={<SupplierAccount />} />
            <Route path="/usersAttendance" element={<UserAttendance />} />
            <Route path="/leaveRequests" element={<LeaveRequests />} />
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/employeeWithdraw" element={<EmployeeWithdraw />} />
            <Route path="/projects" element={<ProjectsDetails />} />
            <Route path="/projectCatogries" element={<ProjectsCatogries />} />
            <Route path="/assignprojects" element={<AssignProjects />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/quotations" element={<Quotation />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/expensesCatogries" element={<ExpensesCatogries />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/salaryCycle" element={<SalaryCycle />} />
            <Route path="/advanceSalary" element={<AdvanceSalary />} />
            <Route path="/applyLoan" element={<Loan />} />
            <Route path="/overTime" element={<OverTime />} />
            <Route path="/applicants" element={<Applicants />} />
            <Route path="/job" element={<Jobs />} />
            <Route path="/configEmployeeSalaries" element={<ConfigEmpSalary />} />
            <Route path="/attendanceRules" element={<AttendanceRule />} />
            <Route path="/employeeAccount" element={<EmployeeAccount />} />
            <Route path="/salesReports" element={<SalesReports />} />
            <Route path="/progressReports" element={<ProgressReports />} />
            <Route path="/attendanceReports" element={<AttendanceReports />} />
            <Route path="/taskReports" element={<ProcessReports />} />
            <Route path="/paymentReports" element={<PaymentsReports />} />
            <Route path="/expenseReports" element={<ExpenseReports />} />
            <Route path="/User/dashboard-admin-view" element={<UserDashboard />} />
          </Route>

          <Route element={currentUser?.role === 'user' ? <EmployeePrivateLayout /> : <Navigate to="/" />}>
            <Route path="/User/dashboard" element={<EmployeeDashboard />} />
            <Route path="/user/profile" element={<EmployeeProfile />} />
            <Route path="/user/promotion" element={<Promotion />} />
            <Route path="/user/resignation" element={<Resignation />} />
            <Route path="/user/rejoin" element={<Rejoin />} />
            <Route path="/users/markAttendance" element={<MarkAttendance />} />
            <Route path="/users/leaveRequests" element={<LeaveRequests />} />
            <Route path="/users/assignedprojects" element={<AssignProjects />} />
            <Route path="/users/todo" element={<Todo />} />
            <Route path="/users/progress" element={<Progress />} />
            <Route path="/user/applyLoan" element={<Loan />} />
            <Route path="/user/salarydetail" element={<EmployeeAccount />} />
            <Route path="/user/advanceSalary" element={<AdvanceSalary />} />
            <Route path="/user/overTime" element={<OverTime />} />
            <Route path="/users/progressReports" element={<ProgressReports />} />
            <Route path="/users/attendanceReports" element={<AttendanceReports />} />
            <Route path="/users/taskReports" element={<ProcessReports />} />
          </Route>

        </Route>
      </Routes>
    </Routers>
  );
}

export default App;

import { BrowserRouter as Routers, Routes, Route } from "react-router-dom";
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
import { ConfigTime } from "./Pages/AdminPage/ConfigTime";
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

function App() {
  return (
    <Routers>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* {All Admin Routes deffine here } */}

        <Route element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <PrivateLayout>
                <AdminDashboard />
              </PrivateLayout>
            }
          />

          <Route
            path="/User/dashboard"
            element={
              <EmployeePrivateLayout>
                <EmployeeDashboard />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateLayout>
                <Profile />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/profile"
            element={
              <EmployeePrivateLayout>
                <EmployeeProfile />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateLayout>
                <UsersDetails />
              </PrivateLayout>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateLayout>
                <CustomerDetail />
              </PrivateLayout>
            }
          />

          <Route
            path="/employeeLifeline"
            element={
              <PrivateLayout>
                <EmployeeLifeline />
              </PrivateLayout>
            }
          />

          <Route
            path="/promotion"
            element={
              <PrivateLayout>
                <Promotion />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/promotion"
            element={
              <EmployeePrivateLayout>
                <Promotion />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/user/resignation"
            element={
              <EmployeePrivateLayout>
                <Resignation />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/resignation"
            element={
              <PrivateLayout>
                <Resignation />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/rejoin"
            element={
              <EmployeePrivateLayout>
                <Rejoin />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/rejoin"
            element={
              <PrivateLayout>
                <Rejoin />
              </PrivateLayout>
            }
          />

          <Route
            path="/markAttendance"
            element={
              <PrivateLayout>
                <MarkAttendance />
              </PrivateLayout>
            }
          />

          <Route
            path="/assetsCategory"
            element={
              <PrivateLayout>
                <AssetCategory />
              </PrivateLayout>
            }
          />

          <Route
            path="/assets"
            element={
              <PrivateLayout>
                <Assets />
              </PrivateLayout>
            }
          />

          <Route
            path="/supplier"
            element={
              <PrivateLayout>
                <Suppliers />
              </PrivateLayout>
            }
          />

          <Route
            path="/customerAccount"
            element={
              <PrivateLayout>
                <CustomerAccount />
              </PrivateLayout>
            }
          />

          <Route
            path="/supplierAccount"
            element={
              <PrivateLayout>
                <SupplierAccount />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/markAttendance"
            element={
              <EmployeePrivateLayout>
                <MarkAttendance />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/usersAttendance"
            element={
              <PrivateLayout>
                <UserAttendance />
              </PrivateLayout>
            }
          />
          <Route
            path="/leaveRequests"
            element={
              <PrivateLayout>
                <LeaveRequests />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/leaveRequests"
            element={
              <EmployeePrivateLayout>
                <LeaveRequests />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/holidays"
            element={
              <PrivateLayout>
                <Holidays />
              </PrivateLayout>
            }
          />
          <Route
            path="/employeeWithdraw"
            element={
              <PrivateLayout>
                <EmployeeWithdraw />
              </PrivateLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateLayout>
                <ProjectsDetails />
              </PrivateLayout>
            }
          />
          <Route
            path="/projectCatogries"
            element={
              <PrivateLayout>
                <ProjectsCatogries />
              </PrivateLayout>
            }
          />
          <Route
            path="/assignprojects"
            element={
              <PrivateLayout>
                <AssignProjects />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/assignedprojects"
            element={
              <EmployeePrivateLayout>
                <AssignProjects />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/todo"
            element={
              <PrivateLayout>
                <Todo />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/todo"
            element={
              <EmployeePrivateLayout>
                <Todo />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/progress"
            element={
              <PrivateLayout>
                <Progress />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/progress"
            element={
              <EmployeePrivateLayout>
                <Progress />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/sales"
            element={
              <PrivateLayout>
                <Sales />
              </PrivateLayout>
            }
          />
          <Route
            path="/quotations"
            element={
              <PrivateLayout>
                <Quotation />
              </PrivateLayout>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateLayout>
                <Payments />
              </PrivateLayout>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateLayout>
                <Expenses />
              </PrivateLayout>
            }
          />
          <Route
            path="/expensesCatogries"
            element={
              <PrivateLayout>
                <ExpensesCatogries />
              </PrivateLayout>
            }
          />

          <Route
            path="/calendar"
            element={
              <PrivateLayout>
                <Calendar />
              </PrivateLayout>
            }
          />
          <Route
            path="/salaryCycle"
            element={
              <PrivateLayout>
                <SalaryCycle />
              </PrivateLayout>
            }
          />

          <Route
            path="/advanceSalary"
            element={
              <PrivateLayout>
                <AdvanceSalary />
              </PrivateLayout>
            }
          />

          <Route
            path="/applyLoan"
            element={
              <PrivateLayout>
                <Loan />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/applyLoan"
            element={
              <EmployeePrivateLayout>
                <Loan />
              </EmployeePrivateLayout>
            }
          />
          <Route
            path="/user/applyLoan"
            element={
              <EmployeePrivateLayout>
                <Loan />
              </EmployeePrivateLayout>
            }
          />
          <Route
            path="/user/salarydetail"
            element={
              <EmployeePrivateLayout>
                <EmployeeAccount />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/user/advanceSalary"
            element={
              <EmployeePrivateLayout>
                <AdvanceSalary />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/overTime"
            element={
              <PrivateLayout>
                <OverTime />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/overTime"
            element={
              <EmployeePrivateLayout>
                <OverTime />
              </EmployeePrivateLayout>
            }
          />
          <Route
            path="/applicants"
            element={
              <PrivateLayout>
                <Applicants />
              </PrivateLayout>
            }
          />

          <Route
            path="/job"
            element={
              <PrivateLayout>
                <Jobs />
              </PrivateLayout>
            }
          />

          <Route
            path="/configEmployeeSalaries"
            element={
              <PrivateLayout>
                <ConfigEmpSalary />
              </PrivateLayout>
            }
          />
          <Route
            path="/configTime"
            element={
              <PrivateLayout>
                <ConfigTime />
              </PrivateLayout>
            }
          />
          <Route
            path="/employeeAccount"
            element={
              <PrivateLayout>
                <EmployeeAccount />
              </PrivateLayout>
            }
          />
          <Route
            path="/salesReports"
            element={
              <PrivateLayout>
                <SalesReports />
              </PrivateLayout>
            }
          />
          <Route
            path="/progressReports"
            element={
              <PrivateLayout>
                <ProgressReports />
              </PrivateLayout>
            }
          />

          <Route
            path="users/progressReports"
            element={
              <EmployeePrivateLayout>
                <ProgressReports />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/attendanceReports"
            element={
              <PrivateLayout>
                <AttendanceReports />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/attendanceReports"
            element={
              <EmployeePrivateLayout>
                <AttendanceReports />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/taskReports"
            element={
              <PrivateLayout>
                <ProcessReports />
              </PrivateLayout>
            }
          />

          <Route
            path="/users/taskReports"
            element={
              <EmployeePrivateLayout>
                <ProcessReports />
              </EmployeePrivateLayout>
            }
          />

          <Route
            path="/paymentReports"
            element={
              <PrivateLayout>
                <PaymentsReports />
              </PrivateLayout>
            }
          />
          <Route
            path="/expenseReports"
            element={
              <PrivateLayout>
                <ExpenseReports />
              </PrivateLayout>
            }
          />
          {/* {All User Routes define here} */}

          <Route
            path="/user/dashboard"
            element={
              <PrivateLayout>
                <UserDashboard />
              </PrivateLayout>
            }
          />
        </Route>
      </Routes>
    </Routers>
  );
}

export default App;

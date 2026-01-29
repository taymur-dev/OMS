import { EmployeeDashboard } from "../Components/Employee/EmployeeDashboard";
import { Footer } from "../Components/Footer";

export const UserDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <EmployeeDashboard />
      </main>
      <Footer /> 
    </div>
  );
};
import { useState } from "react";
import { Outlet } from "react-router-dom"; // Outlet import karein
import { Header } from "../../Header";
import { EmployeeSideBar } from "../../Employee/EmployeeSideBar";

export const EmployeePrivateLayout = () => {
  const [isOpen, setIsopen] = useState(false);

  const toggleSideBar = () => {
    setIsopen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header isOpen={isOpen} toggleSideBar={toggleSideBar} />

      <div className="flex flex-1 overflow-hidden">
        <EmployeeSideBar isOpen={isOpen} />

        <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
          <div className="">
            {/* Employee routes yahan render honge */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

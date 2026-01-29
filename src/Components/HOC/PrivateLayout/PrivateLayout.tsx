import { useState } from "react";
import { Outlet } from "react-router-dom"; 
import { Header } from "../../Header";
import { SideBar } from "../../SideBar";

export const PrivateLayout = () => {
  const [isOpen, setIsopen] = useState(false);

  const toggleSideBar = () => {
    setIsopen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header isOpen={isOpen} toggleSideBar={toggleSideBar} />
      
      <div className="flex flex-1 overflow-hidden">
        <SideBar isOpen={isOpen} setIsOpen={setIsopen} />
        
        <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
          <div className="">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};
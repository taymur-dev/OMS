import { useState } from "react";
import { Header } from "../../Header";
import { SideBar } from "../../SideBar";
import { Footer } from "../../Footer";

export interface IPrivateLayout extends React.ComponentPropsWithoutRef<"div"> {}
// export const PrivateLayout = ({ children }: IPrivateLayout) => {
//   const [isOpen, setIsopen] = useState(false);

//   const toggleSideBar = () => {
//     setIsopen((prev) => !prev);
//   };

//   return (
//     <div className="flex flex-col h-screen overflow-y-auto">
//       <Header isOpen={isOpen} toggleSideBar={toggleSideBar} />
//       <div className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto">
//         <div className="flex flex-grow overflow-y-auto">
//           <SideBar isOpen={isOpen} />
//           {children}
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// PrivateLayout.tsx

export const PrivateLayout = ({ children ,  }: IPrivateLayout) => {
  const [isOpen, setIsopen] = useState(false);

  const toggleSideBar = () => {
    setIsopen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <Header isOpen={isOpen} toggleSideBar={toggleSideBar} />
      <div className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto">
        <div className="flex flex-grow overflow-y-auto">
          {/* FIX: Added setIsOpen prop here */}
          <SideBar isOpen={isOpen} setIsOpen={setIsopen} /> 
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};
// import { ReactNode } from "react";
// import { Link } from "react-router-dom";

// type CardProps = {
//   titleName: string;
//   totalUser: string;
//   totalNumber: number;
//   icon: ReactNode;
//   style: string;
// };

// const Card = ({ titleName, totalNumber, icon, style }: CardProps) => {
//   return (
//     <div
//       className={`w-full mx-2 h-[120px] rounded-lg shadow-lg p-4 flex flex-col justify-between ${style} text-white relative overflow-hidden`}
//     >
//       {/* Background Circles */}
//       <div className="absolute top-[-30px] right-[-20px] w-[120px] h-[120px] bg-white opacity-20 rounded-full"></div>
//       <div className="absolute bottom-[-30px] left-[-20px] w-[100px] h-[100px] bg-white opacity-20 rounded-full"></div>

//       {/* Icon & Title */}
//       <div className="relative flex items-center justify-between">
//         <span className=" ">{titleName}</span>
//         <div className="text-3xl">{icon}</div>
//       </div>

//       {/* Number */}
//       <p className="relative text-3xl font-bold">{totalNumber}</p>
//       <div className="text-center shadow ">
//         <Link className="shadow-2xl" to={""}>
//           More info
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Card;

import { ReactNode } from "react";
import { Link } from "react-router-dom";

type CardProps = {
  titleName: string;
  totalUser: string;
  totalNumber: number;
  icon: ReactNode;
  style: string;
};

const Card = ({ titleName, totalNumber, icon, style }: CardProps) => {
  return (
    <div
      className={`w-auto  h-[140px] rounded-xl shadow-lg p-5 flex flex-col justify-between 
    ${style} text-white relative overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl`}
    >
      {/* Background Circles */}
      <div className="absolute -top-6 -right-6 w-[120px] h-[120px] bg-white opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-6 -left-6 w-[100px] h-[100px] bg-white opacity-10 rounded-full animate-pulse"></div>

      {/* Icon & Title */}
      <div className="relative flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-wide">{titleName}</h3>
        <div className="text-4xl">{icon}</div>
      </div>

      {/* Number */}
      <p className="relative text-3xl font-bold mt-2">{totalNumber}</p>

      {/* More Info Button */}
      <div className="mt-3">
        <Link to=""></Link>
      </div>
    </div>
  );
};

export default Card;

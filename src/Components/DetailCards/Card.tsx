import { ReactNode } from "react";
import { Link } from "react-router-dom";

type CardProps = {
  titleName: string;
  totalUser?: string; 
  totalNumber: number;
  icon: ReactNode;
  style: string;
  isCurrency?: boolean; 
};

const Card = ({ titleName, totalNumber, icon, style, isCurrency }: CardProps) => {
  return (
    <div
      className={`w-auto h-[140px] rounded-xl shadow-lg p-5 flex flex-col justify-between 
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
      <p className="relative text-3xl font-bold mt-2">
        {isCurrency
          ? `${Number(totalNumber).toLocaleString()}`
          : totalNumber}
      </p>

      {/* More Info Button */}
      <div className="mt-3">
        <Link to=""></Link>
      </div>
    </div>
  );
};

export default Card;

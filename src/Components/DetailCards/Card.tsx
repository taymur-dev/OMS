import { ReactNode } from "react";

type CardProps = {
  titleName: string;
  totalUser?: string; // Kept for prop consistency
  totalNumber: number;
  icon: ReactNode;
  style?: string;
  isCurrency?: boolean;
};

const Card = ({
  titleName,
  totalNumber,
  icon,
  style = "",
  isCurrency,
}: CardProps) => {
  return (
    <div
      className={`
        h-full min-h-[110px]
        rounded-2xl
        border-1 hover:border-white border-indigo-900 
        bg-white
        shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        px-4 
        flex flex-col justify-between
        relative overflow-hidden
        transition-all duration-300 ease-in-out
        hover:translate-y-[-4px]
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
        group
        ${style}
      `}
    >
      {/* Subtle Background Accent - Modern Industry Standard */}
      <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-500"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-md mt-2 font-normal text-black">
              {titleName}
            </p>
          </div>

          {/* Icon Container with subtle glass effect */}
          <div
            className="w-9 h-9 mt-2 flex items-center justify-center rounded-xl bg-indigo-900 
          text-white group-hover:bg-indigo-800 group-hover:text-white transition-all duration-300 shadow-sm"
          >
            <span className="text-1xl">{icon}</span>
          </div>
        </div>

        {/* Value Section */}
        <div className="mb-2">
          <h2 className="text-md font-normal text-gray-900 tracking-tight">
            {isCurrency
              ? `${Number(totalNumber).toLocaleString()}`
              : totalNumber.toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Card;

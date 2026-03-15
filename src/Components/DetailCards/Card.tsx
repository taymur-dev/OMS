import { ReactNode } from "react";

type CardProps = {
  titleName: string;
  totalNumber: number;
  icon?: ReactNode; // Now optional to support different footer styles
  footer?: ReactNode; 
  isCurrency?: boolean;
  style?: string;
  onClick?: () => void;
};

const Card = ({
  titleName,
  totalNumber,
  footer,
  isCurrency,
  style = "bg-white border border-blue-400 hover:border-white",
  onClick,
}: CardProps) => {
  const formatCompact = (val: number) => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(val);
  };

  const formattedValue = isCurrency
    ? `${formatCompact(totalNumber)}`
    : totalNumber.toLocaleString();

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-between
        ${style} rounded-[18px] p-4 h-full w-full
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]  
        transition-all duration-300 hover:shadow-lg 
      `}
    >
      {/* Top Section: Number and Title */}
      <div className="flex flex-col items-center text-center space-y-1 mt-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          {formattedValue}
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {titleName}
        </p>
      </div>

      {/* Footer Section: Icons/Charts/Progress */}
      <div className="w-full flex justify-center items-center min-h-[40px] mt-4">
        {footer}
      </div>
    </div>
  );
};

export default Card;
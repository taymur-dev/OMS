import { ReactNode } from "react";

type CardProps = {
  titleName: string;
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
  const formatCompact = (val: number) => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    })
      .format(val)
      .toLowerCase();
  };

  const formattedValue = isCurrency
    ? `${formatCompact(totalNumber)}`
    : totalNumber.toLocaleString();

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        rounded-[12px] md:rounded-[24px] 
        p-4  /* Increased padding for better visibility */
        border border-blue-400 hover:border-gray-100 shadow-sm
        transition-all duration-300 hover:shadow-md hover:-translate-y-1
        w-full min-w-[100px] aspect-square
        overflow-hidden
        ${style || "bg-white text-slate-800"} /* Fallback to white bg if no style */
      `}
    >
      <div className="mb-1 md:mb-3 flex items-center justify-center w-10 h-10 md:w-14 md:h-14">
        {/* Ensure the icon inherits the parent text color */}
        <div className="text-2xl md:text-4xl transition-transform duration-300 hover:scale-110">
          {icon}
        </div>
      </div>

      <p
        className={`text-[10px] md:text-[11px] font-bold uppercase tracking-tight mb-0.5 md:mb-1 text-center whitespace-nowrap px-1 
        ${style.includes("text-white") ? "text-white/80" : "text-gray-500"}`}
      >
        {titleName}
      </p>

      <h2 className="text-base md:text-2xl font-black tracking-tight text-center truncate w-full px-1">
        {formattedValue}
      </h2>
    </div>
  );
};

export default Card;

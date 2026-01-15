import { ReactNode } from "react";

type CardProps = {
  titleName: string;
  totalUser?: string;
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
       h-full min-h-[150px]
       rounded-xl
       border-2 border-indigo-900
       bg-white
       shadow-lg
       p-5
       flex flex-col justify-between
       text-gray-800
       relative overflow-hidden
       transform transition-all duration-300
       hover:scale-[1.03]
       hover:shadow-2xl
       hover:border-white

        ${style}
      `}
    >
      {/* Decorative Circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gainsboro-100 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gainsboro-100 rounded-full"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black-">{titleName}</h3>

        {/* Icon with blue background */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-900 text-white text-2xl">
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="relative text-3xl font-bold text-gray-900">
        {isCurrency ? Number(totalNumber).toLocaleString() : totalNumber}
      </div>
    </div>
  );
};

export default Card;

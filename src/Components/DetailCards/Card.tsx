import { ReactNode } from "react";

type CardProps = {
  titleName: string;
  totalUser?: string;
  totalNumber: number;
  icon: ReactNode;
  style: string;
  isCurrency?: boolean;
};

const Card = ({
  titleName,
  totalNumber,
  icon,
  style,
  isCurrency,
}: CardProps) => {
  return (
    <div
      className={`h-full min-h-[150px] rounded-xl shadow-lg p-5
      flex flex-col justify-between text-white
      ${style}
      relative overflow-hidden
      transform transition-all hover:scale-[1.03] hover:shadow-2xl`}
    >
      {/* Decorative Circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <h3 className="text-lg font-semibold">{titleName}</h3>
        <div className="text-4xl">{icon}</div>
      </div>

      {/* Value */}
      <div className="relative text-3xl font-bold">
        {isCurrency ? Number(totalNumber).toLocaleString() : totalNumber}
      </div>
    </div>
  );
};

export default Card;

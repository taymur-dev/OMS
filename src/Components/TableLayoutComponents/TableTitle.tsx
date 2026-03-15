import { ReactNode } from "react";

type TableTitleProps = {
  tileName: string;
  rightElement?: ReactNode;
};

export const TableTitle = ({ tileName, rightElement }: TableTitleProps) => {
  const titleStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    fontSize: "18px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    color: "#000508", 
  };

  return (
    <div className="flex flex-row justify-between pl-4 pr-2 gap-2 sm:gap-4 my-4 text-gray-700">
      <h1 style={titleStyle}>{tileName}</h1>

      <div className="w-full flex justify-end mr-2">{rightElement}</div>
    </div>
  );
};

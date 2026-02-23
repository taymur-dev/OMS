import { ReactNode } from "react";

type TableTitleProps = {
  tileName: string;
  rightElement?: ReactNode;
};

export const TableTitle = ({ tileName, rightElement }: TableTitleProps) => {
  return (
    <div className="flex flex-row justify-between px-3 gap-2 sm:gap-4 my-4 text-gray-700">
      <h1 className="text-xl sm:text-2xl  md:text-3xl  font-extrabold tracking-tight whitespace-nowrap">
        {tileName}
      </h1>

      <div className="w-full flex justify-end  mr-2">
        {rightElement}
      </div>
    </div>
  );
};

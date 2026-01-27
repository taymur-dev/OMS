import { ReactNode } from "react";

type TableTitleProps = {
  tileName: string;
  rightElement?: ReactNode;
};

export const TableTitle = ({ tileName, rightElement }: TableTitleProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-4 my-4 text-gray-700">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ml-2">
        {tileName}
      </h1>

      <div className="mr-2">{rightElement}</div>
    </div>
  );
};

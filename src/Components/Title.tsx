import React from "react";
import { RxCross1 } from "react-icons/rx";
type TitleProps = {
  children: React.ReactNode;
  setModal: () => void;
  className?: string;
};

export const Title = ({ children, setModal }: TitleProps) => {
  return (
    <div>
      <div className="flex  items-center justify-between p-3 text-white font-sans">
        <span className="font-semibold text-2xl">{children}</span>
        <span className="hover:cursor-pointer">
          <RxCross1 size={22} onClick={() => setModal()} title="Close" />
        </span>
      </div>
      <div className="border-b mx-1 border-gray-300"></div>
    </div>
  );
};

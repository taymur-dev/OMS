import React from "react";

type AccordionItemProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export const AccordionItem = ({ children, isOpen }: AccordionItemProps) => {
  return (
    <div className="text-xs text-black w-full mx-2">
      <ul>
        <li className="">
          <div className={`${isOpen ? "md:hidden" : "block"}`}>{children}</div>
        </li>
      </ul>
    </div>
  );
};

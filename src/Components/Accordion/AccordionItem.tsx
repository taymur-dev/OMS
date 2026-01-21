import React from "react";

type AccordionItemProps = {
  children: React.ReactNode;
  isOpen: boolean; // true = thin (collapsed), false = wide (expanded)
};

export const AccordionItem = ({ children, isOpen }: AccordionItemProps) => {
  return (
    <div className="text-xs text-black w-full mx-2">
      <ul>
        <li className="">
          {/* Logic: 
             - On mobile (hidden md:), always show children.
             - On desktop (md:), only show children if sidebar is NOT thin (!isOpen).
          */}
          <div className={`${isOpen ? "md:hidden" : "block"}`}>
            {children}
          </div>
        </li>
      </ul>
    </div>
  );
};
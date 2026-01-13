import { PiEye } from "react-icons/pi";
type ViewButtonProps = {
  handleView: () => void;
};
export const ViewButton = ({ handleView }: ViewButtonProps) => {
  return (
    <div
      onClick={() => handleView()}
      className="flex items-center gap-0.5 bg-green-500 p-1 rounded-xl py-0.5 px-2 text-white  hover:cursor-pointer active:scale-95 transition-all duration-300"
    >
      <span className="text-[10px]"></span>
      <PiEye size={20} className="view-button" title="View" />
    </div>
  );
};

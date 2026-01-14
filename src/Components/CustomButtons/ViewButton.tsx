import { PiEye } from "react-icons/pi";

type ViewButtonProps = {
  handleView: () => void;
};

export const ViewButton = ({ handleView }: ViewButtonProps) => {
  return (
    <div
      onClick={handleView}
      className="
        flex items-center gap-0.5
        bg-grey
        p-1 py-0.5 px-2
        rounded-xl
        border border-green-500
        hover:bg-green-50
        hover:cursor-pointer
        active:scale-95
        transition-all duration-300
      "
    >
      <PiEye
        size={20}
        className="text-green-500"
        title="View"
      />
    </div>
  );
};

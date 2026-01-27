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
        p-0.5 py-0.5 px-1
        rounded-lg
        bg-blue-50
        hover:cursor-pointer
        active:scale-95
        transition-all duration-300
      "
    >
      <PiEye
        size={15}
        className="text-green-500"
        title="View"
      />
    </div>
  );
};

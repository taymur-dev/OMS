import { RiDeleteBin5Line } from "react-icons/ri";
type DeleteButtonProps = {
  handleDelete: () => void;
};

export const DeleteButton = ({ handleDelete }: DeleteButtonProps) => {
  return (
    <div
      onClick={() => handleDelete()}
      className="
        flex items-center gap-0.5
        bg-grey
        p-1 py-0.5 px-2
        rounded-xl
        border border-red-500
        hover:bg-red-50
        hover:cursor-pointer
        active:scale-95
        transition-all duration-300
      "
    >
      <span className="text-[10px]"></span>
      <RiDeleteBin5Line size={20} className="text-red-500" title="Delete" />
    </div>
  );
};

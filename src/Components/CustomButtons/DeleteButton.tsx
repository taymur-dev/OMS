import { RiDeleteBin5Line } from "react-icons/ri";
type DeleteButtonProps = {
  handleDelete: () => void;
};

export const DeleteButton = ({ handleDelete }: DeleteButtonProps) => {
  return (
    <div
      onClick={() => handleDelete()}
      className="flex items-center gap-0.5 bg-red-500 rounded-xl py-0.5 px-2 text-white  hover:cursor-pointer active:scale-95 transition-all duration-300"
    >
      <span className="text-[10px]"></span>
      <RiDeleteBin5Line size={20} className="delete-button" title="Delete" />
    </div>
  );
};

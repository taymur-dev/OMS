import { AiTwotoneEdit } from "react-icons/ai";
type EditButtonProps = {
  handleUpdate: () => void;
};
export const EditButton = ({ handleUpdate }: EditButtonProps) => {
  return (
    <div
      onClick={() => handleUpdate()}
      className="flex items-center gap-0.5 p-1 bg-sky-500 rounded-xl py-0.5 px-2 text-white  hover:cursor-pointer active:scale-95 transition-all duration-300"
    >
      <span className="text-[10px]"></span>
      <AiTwotoneEdit size={22} className="edit-button" title="Edit" />
    </div>
  );
};

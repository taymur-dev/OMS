import { AiTwotoneEdit } from "react-icons/ai";
type EditButtonProps = {
  handleUpdate: () => void;
};
export const EditButton = ({ handleUpdate }: EditButtonProps) => {
  return (
    <div
      onClick={() => handleUpdate()}
      className="
        flex items-center gap-0.5
        bg-grey
        p-1 py-0.5 px-2
        rounded-xl
        border border-blue-500
        hover:bg-blue-50
        hover:cursor-pointer
        active:scale-95
        transition-all duration-300
      "
    >
      <span className="text-[10px]"></span>
      <AiTwotoneEdit   size={20}
        className="text-blue-500"
        title="Edit" />
    </div>
  );
};

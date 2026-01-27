type CancelBtnProps = {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export const CancelBtn = ({ setModal }: CancelBtnProps) => {
  return (
    <div>
      <button
        onClick={() => setModal(false)}
        className="bg-gray-100 px-3 py-1 text-gray-800 border border-gray-300 rounded hover:cursor-pointer hover:scale-105 duration-300 "
      >
        Cancel
      </button>
    </div>
  );
};

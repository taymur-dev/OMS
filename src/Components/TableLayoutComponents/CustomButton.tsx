type buttonProps = {
  label: string;
  handleToggle: () => void;
};
export const CustomButton = ({ label, handleToggle }: buttonProps) => {
  return (
    <div>
      <button
        onClick={handleToggle}
        className="bg-indigo-900 text-white px-2 py-1 rounded my-2 hover:opacity-95 hover:cursor-pointer active:scale-95 transition-all duration-200"
      >
        {label}
      </button>
    </div>
  );
};

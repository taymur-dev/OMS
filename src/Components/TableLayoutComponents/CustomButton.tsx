type buttonProps = {
  label: string;
  handleToggle: () => void;
};
export const CustomButton = ({ label, handleToggle }: buttonProps) => {
  return (
    <div>
     <button
  onClick={handleToggle}
  className="bg-indigo-900 text-white px-2 py-1 my-2 rounded-xl shadow-[0_0_10px_rgba(40,40,120,0.3)] 
   hover:opacity-95 hover:cursor-pointer active:scale-95 transition-all duration-300"
>
  {label}
</button>
    </div>
  );
};

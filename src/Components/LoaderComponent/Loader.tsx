import { DotLoader } from "react-spinners";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh] mx-auto ">
      <DotLoader size={30} color="#3b82f6" />
    </div>
  );
};

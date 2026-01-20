import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/Hooks";

type TableTitleProps = {
  tileName: string;
  activeFile: string;
};
export const TableTitle = ({ tileName, activeFile }: TableTitleProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const isAdmin = currentUser?.role;

  return (
    <div className="flex items-center justify-between my-1.5 text-gray-700">
      {/* <h1 className="text-4xl font-sans font-semibold">{tileName}</h1> */}

      <h1 className="text-2xl sm:text-4xl font-sans font-semibold">
        {tileName}
      </h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-700 hover:text-gray-900 transition">
          <MdOutlineKeyboardBackspace className="text-xl cursor-pointer mt-[0.20rem]" />
          <Link
            className="hover:underline font-medium"
            to={isAdmin === "admin" ? "/" : "/user/dashBoard"}
          >
            Back to Dashboard
          </Link>
          <span className="text-gray-500 mx-1">/</span>
          <p className="font-semibold text-gray-800">{activeFile}</p>
        </div>
      </div>
    </div>
  );
};

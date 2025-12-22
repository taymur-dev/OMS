import { useEffect, useRef, useState } from "react";
import { FiUser, FiLock, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { logOut, resetStore } from "../../redux/UserSlice";
import { ProfileChangePassword } from "./ProfileChangePassword";

type PASSWORDT = "VIEW" | "";

const ProfileDropdown = ({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean;
  setIsOpenModal: (value: string) => void;
}) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const isAdmin = currentUser?.role;

  const [viewPasswordModal, setViewPasswordModal] = useState<PASSWORDT | null>(
    null
  );
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(""); 
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpenModal]);

  const handleClose = () => {
    setIsOpenModal(""); 
  };
  const handleLogoutUser = () => {
    setIsOpenModal("");
    dispatch(logOut());
    dispatch(resetStore());
  };

  return (
    isOpenModal && (
      <div ref={dropdownRef} className="relative z-20">
        <ul className="absolute right-0 mt-2 w-52 rounded-lg bg-white shadow-lg border border-gray-200">
          <li className="border-b border-gray-200">
            <Link
              to={isAdmin === "admin" ? "/profile" : "/user/profile"}
              onClick={handleClose} 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800"
            >
              <FiUser className="text-gray-800" /> Profile
            </Link>
          </li>
          <li className="border-b border-gray-200">
            <span
              onClick={() => setViewPasswordModal("VIEW")} 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-gray-800"
            >
              <FiLock className="text-gray-800" /> Change Password
            </span>
          </li>
          <li>
            <div
              onClick={handleLogoutUser}
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-100 text-red-600 font-semibold"
            >
              <FiLogOut className="text-red-500" /> Log Out
            </div>
          </li>
        </ul>
        {viewPasswordModal && (
          <ProfileChangePassword setModal={() => setIsOpenModal("")} />
        )}
      </div>
    )
  );
};

export default ProfileDropdown;

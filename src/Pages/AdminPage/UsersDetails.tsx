type UserType = {
  id: number;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  address: string;
  date: string;
  password: string;
  confirmPassword: string;
  role: string;
  loginStatus: string;
};

import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useEffect, useState, useCallback } from "react";
import { AddUser } from "../../Components/UserComponent/AddUser";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { RiLockPasswordFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { ComfirmPasswordModal } from "../../Components/ComfirmPasswordModal";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { ViewUserDetailModal } from "../../Components/ViewUserDetailModal";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";

const numbers = [10, 25, 50, 100];

export const UsersDetails = () => {
  const [catchId, setCatchId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);

  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [viewUserDetail, setViewUserDetail] = useState<UserType>(
    {} as UserType
  );
  const [modalTypeTooPen, setModalTypeTooPen] = useState<
    "ADD" | "UPDATE" | "VIEW" | "CONFIRM PASSWORD" | "DELETE" | ""
  >("");
  const [editUser, setEditUser] = useState<UserType | null>(null);

  const handlerGetUsers = useCallback(async () => {
    dispatch(navigationStart());
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res?.data?.users);
      dispatch(navigationSuccess("Users"));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message);
    }
  }, [token, dispatch]);

  useEffect(() => {
    document.title = "(OMS)ALL USERS";
    handlerGetUsers();
  }, [handlerGetUsers]);

  if (loader) return <Loader />;

  const activeUsers = allUsers.filter(
    (user) =>
      user.loginStatus === "Y" &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contact.includes(searchTerm))
  );

  const totalNum = activeUsers.length;

  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;

  const paginatedUsers = activeUsers.slice(startIndex, endIndex);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / selectedValue);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handleDeleteUser = async (id: number | null) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteUser/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      handlerGetUsers();
      toast.info("User deleted successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message);
    }
  };

  const handleUpdateSingleUser = (user: UserType) => {
    setModalTypeTooPen("UPDATE");
    setEditUser(user);
  };

  const handleViewUserDetail = (user: UserType) => {
    setModalTypeTooPen("VIEW");
    setViewUserDetail(user);
  };

  const handleCatchId = (id: number) => {
    setModalTypeTooPen("CONFIRM PASSWORD");
    setCatchId(id);
  };

  const handleDeleteModal = (id: number) => {
    setCatchId(id);
    setModalTypeTooPen("DELETE");
  };

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="User" activeFile="User list" />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white 
      overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Number of Users :
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{allUsers.filter((u) => u.loginStatus === "Y").length}]
            </span>
          </span>

          <CustomButton
            handleToggle={() => setModalTypeTooPen("ADD")}
            label="Add User"
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
                {numbers.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] bg-gray-200 text-gray-900
           font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span className="text-left">Users</span>
            <span className="text-left">Email</span>
            <span className="text-left">Contact No</span>
            <span className="text-left">Position</span>
            <span className="text-left">Joining Date</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedUsers.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-2">
              No records available at the moment!
            </div>
          ) : (
            paginatedUsers.map((user, index) => (
              <div
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1.5fr] border border-gray-600 
                text-gray-800 hover:bg-gray-100 transition duration-200 text-sm p-[7px]"
                key={user.id}
              >
                <span>{startIndex + index + 1}</span>
                <span>{user.name}</span>
                <span>{user.email.slice(0, 15)}</span>
                <span>{user.contact}</span>
                <span>{user.role}</span>
                <span>
                  {new Date(user.date).toLocaleDateString("en-GB", {
                    timeZone: "Asia/Karachi",
                  })}
                </span>

                <span className="flex items-center justify-center gap-1">
                  <EditButton
                    handleUpdate={() => handleUpdateSingleUser(user)}
                  />
                  <ViewButton handleView={() => handleViewUserDetail(user)} />
                  <DeleteButton
                    handleDelete={() => handleDeleteModal(user.id)}
                  />

                  <div
                    onClick={() => handleCatchId(user.id)}
                    className="flex items-center gap-0.5 bg-gray-500 rounded-2xl py-0.5 px-2 
                    text-white cursor-pointer"
                  >
                    <span className="text-[10px]">Password</span>
                    <RiLockPasswordFill size={20} className="rounded p-0.5" />
                  </div>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {(modalTypeTooPen === "ADD" || modalTypeTooPen === "UPDATE") && (
        <AddUser
          viewType={modalTypeTooPen}
          handlerGetUsers={handlerGetUsers}
          userId={editUser?.id}
          setModal={() => {
            setEditUser(null);
            setModalTypeTooPen("");
          }}
          onSuccesAction={() => {
            setEditUser(null);
            setModalTypeTooPen("");
          }}
          {...(editUser
            ? {
                initialValues: {
                  userId: editUser.id,
                  name: editUser.name,
                  address: editUser.address,
                  cnic: editUser.cnic,
                  contact: editUser.contact,
                  date: new Date(editUser.date).toLocaleDateString("sv-SE"),
                  email: editUser.email,
                  password: editUser.confirmPassword,
                  role: editUser.role,
                },
              }
            : {})}
        />
      )}

      {modalTypeTooPen === "VIEW" && (
        <ViewUserDetailModal
          setModal={() => setModalTypeTooPen("")}
          viewUserDetail={viewUserDetail}
        />
      )}

      {modalTypeTooPen === "CONFIRM PASSWORD" && (
        <ComfirmPasswordModal
          setModal={() => setModalTypeTooPen("")}
          catchId={catchId}
        />
      )}

      {modalTypeTooPen === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setModalTypeTooPen("")}
          onClose={() => setModalTypeTooPen("")}
          onConfirm={() => handleDeleteUser(catchId)}
        />
      )}

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>
    </div>
  );
};

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
    {} as UserType,
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
        user.contact.includes(searchTerm)),
  );

  const totalNum = activeUsers.length;

  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;

  const paginatedUsers = activeUsers.slice(startIndex, endIndex);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
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
        { headers: { Authorization: token } },
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
    <div className="w-full px-2 sm:px-4">
      <TableTitle tileName="User" activeFile="User list" />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total Number of Users :
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              [{allUsers.filter((u) => u.loginStatus === "Y").length}]
            </span>
          </span>

          <CustomButton
            handleToggle={() => setModalTypeTooPen("ADD")}
            label="Add User"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm">
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={selectedValue}
                onChange={handleChangeShowData}
                className="bg-transparent outline-none"
              >
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

        {/* Table Wrapper */}
        <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
          <div className="min-w-[900px]">
            {/* Table Header */}
            {/* Table Header */}
            <div
              className="grid grid-cols-[0.5fr_1fr_1.5fr_1fr_1fr_1fr_1.5fr]
  bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Users</span>
              <span>Email</span>
              <span>Contact No</span>
              <span>Position</span>
              <span>Joining Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedUsers.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No records available at the moment!
              </div>
            ) : (
              paginatedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="grid grid-cols-[0.5fr_1fr_1.5fr_1fr_1fr_1fr_1.5fr]
      border border-gray-300 text-gray-800 text-sm pt-2 
      hover:bg-gray-100 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{user.name}</span>
                  <span className="truncate">{user.email}</span>
                  <span>{user.contact}</span>
                  <span>{user.role}</span>
                  <span>
                    {new Date(user.date).toLocaleDateString("sv-SE", {
                      timeZone: "Asia/Karachi",
                    })}
                  </span>

                  {/* Actions */}
                  <span className="flex flex-wrap items-center justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleUpdateSingleUser(user)}
                    />
                    <ViewButton handleView={() => handleViewUserDetail(user)} />
                    <DeleteButton
                      handleDelete={() => handleDeleteModal(user.id)}
                    />
                    <div
                      onClick={() => handleCatchId(user.id)}
                      className="flex items-center p-1 px-2 rounded-xl border hover:bg-gray-100 cursor-pointer transition"
                    >
                      <RiLockPasswordFill size={18} title="Password" />
                    </div>
                  </span>
                </div>
              ))
            )}
          </div>
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

      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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

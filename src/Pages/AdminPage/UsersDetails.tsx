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
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

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
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add User button as the rightElement */}
        <TableTitle
          tileName="User"
          rightElement={
            <CustomButton
              handleToggle={() => setModalTypeTooPen("ADD")}
              label="+ Add User"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={handleChangeShowData}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num, index) => (
                    <option key={index} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-7 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 sm:z-10 p-2"
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
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="grid grid-cols-7 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{user.name}</span>
                  <span className="truncate">{user.email}</span>
                  <span>{user.contact}</span>
                  <span>{user.role}</span>
                  <span>
                    {new Date(user.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleUpdateSingleUser(user)}
                    />
                    <ViewButton handleView={() => handleViewUserDetail(user)} />
                    <DeleteButton
                      handleDelete={() => handleDeleteModal(user.id)}
                    />
                    <div
                      onClick={() => handleCatchId(user.id)}
                      className="p-1 px-1.5 rounded-xl bg-blue-50 hover:cursor-pointer active:scale-95 transition-all"
                    >
                      <RiLockPasswordFill size={15} title="Password" />
                    </div>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between">
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

      {/* --- MODALS SECTION --- */}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

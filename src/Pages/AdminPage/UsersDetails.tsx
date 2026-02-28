import { useEffect, useState, useCallback } from "react";
import { AddUser } from "../../Components/UserComponent/AddUser";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
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
import {
  RiLockPasswordFill,
  RiPhoneLine,
  RiCalendarLine,
  RiBriefcaseLine,
} from "react-icons/ri";

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
  image?: string; // Add image field
};

// Added props to interface with People.tsx
interface UsersDetailsProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

export const UsersDetails = ({
  triggerAdd,
  externalSearch,
  externalPageSize,
}: UsersDetailsProps) => {
  const [catchId, setCatchId] = useState<number | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
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

  // Reset page number when search or page size changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      setModalTypeTooPen("ADD");
    }
  }, [triggerAdd]);

  if (loader) return <Loader />;

  // Filtering using externalSearch prop
  const activeUsers = allUsers.filter(
    (user) =>
      user.loginStatus === "Y" &&
      (user.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(externalSearch.toLowerCase()) ||
        user.contact.includes(externalSearch) ||
        user.cnic.includes(externalSearch) ||
        user.role.toLowerCase().includes(externalSearch.toLowerCase()) ||
        user.address.toLowerCase().includes(externalSearch.toLowerCase())),
  );

  const totalNum = activeUsers.length;

  // Calculation using externalPageSize prop
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedUsers = activeUsers.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
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
      toast.success("User deleted successfully");
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    return `${BASE_URL}/${imagePath}`;
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1000px]">
          <div className="px-4 pt-4">
            <div
              className="grid grid-cols-6 text-black rounded items-center font-semibold
                text-sm sticky top-0 z-10 gap-4"
            >
              <span className="pl-2">Sr#</span>
              <span>User Details</span>
              <span>Contact</span>
              <span>Role</span>
              <span>Joining Date</span>
              <span className="text-right pr-10">Actions</span>
            </div>
          </div>

          <div className="p-4">
            {paginatedUsers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed p-10 text-center text-gray-500">
                No records available at the moment!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-6 items-center p-2 gap-4 text-sm bg-white border border-gray-100 
                               rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    {/* Column 1: Sr# */}
                    <span className="pl-2 text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Column 2: User Details with Image */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center
                       text-blue-700 font-bold text-xl flex-shrink-0 overflow-hidden"
                      >
                        {user.image ? (
                          <img
                            src={getImageUrl(user.image) || ""}
                            alt={user.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement?.classList.add(
                                "flex",
                                "items-center",
                                "justify-center",
                              );
                              const fallback = document.createElement("span");
                              fallback.className =
                                "text-blue-700 font-bold text-xl";
                              fallback.textContent = user.name
                                .charAt(0)
                                .toUpperCase();
                              e.currentTarget.parentElement?.appendChild(
                                fallback,
                              );
                            }}
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-gray-800 text-sm">
                          {user.name}
                        </span>
                        <span className="truncate text-gray-500 text-xs">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiPhoneLine
                        className="text-blue-400 flex-shrink-0"
                        size={14}
                      />
                      <span>{user.contact}</span>
                    </div>

                    {/* Column 4: Role */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiBriefcaseLine
                        className="text-green-400 flex-shrink-0"
                        size={14}
                      />
                      <span>{user.role}</span>
                    </div>

                    {/* Column 5: Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiCalendarLine
                        className="text-yellow-400 flex-shrink-0"
                        size={14}
                      />
                      <span>{formatDate(user.date)}</span>
                    </div>

                    {/* Column 6: Actions */}
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => handleViewUserDetail(user)}
                      />
                      <EditButton
                        handleUpdate={() => handleUpdateSingleUser(user)}
                      />
                      <DeleteButton
                        handleDelete={() => handleDeleteModal(user.id)}
                      />
                      <button
                        onClick={() => handleCatchId(user.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        title="Change Password"
                      >
                        <RiLockPasswordFill size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (Pagination) */}
      <div className="flex flex-row items-center justify-between py-4">
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

      {/* Modals */}
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
                  image: editUser.image, // Add image to initialValues
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
    </div>
  );
};

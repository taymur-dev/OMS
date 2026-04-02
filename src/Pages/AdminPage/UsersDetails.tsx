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
  RiUserFill,
  RiInboxArchiveLine,
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
    document.title = "(OMS)ALL EMPLOYEES";
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
  const hiddenRoles = ["admin"];

  const activeUsers = allUsers.filter(
    (user) =>
      user.loginStatus === "Y" &&
      !hiddenRoles.includes(user.role.toLowerCase()) &&
      (user.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(externalSearch.toLowerCase()) ||
        user.contact.includes(externalSearch) ||
        user.cnic.includes(externalSearch) ||
        user.address.toLowerCase().includes(externalSearch.toLowerCase())),
  );

  const totalNum = activeUsers.length;

  // Calculation using externalPageSize prop
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedUsers = activeUsers.slice(startIndex, endIndex);

  const handleDeleteUser = async (id: number | null) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteUser/${id}`,
        {},
        { headers: { Authorization: token } },
      );
      handlerGetUsers();
      toast.success("Employee deleted successfully");
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
  // const getImageUrl = (imagePath: string | undefined) => {
  //   if (!imagePath) return null;
  //   return `${BASE_URL}/${imagePath}`;
  // };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${BASE_URL}/${imagePath}`;
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px] ">
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto] 
    bg-blue-400 text-white rounded-lg items-center font-bold
    text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Name & Email</span>
              <span className="text-left">Contact</span>
              {/* <span className="text-left">Role</span> */}
              <span className="text-left">Joining Date</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedUsers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search term.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto] 
          items-center px-3 py-0.5 gap-3 text-sm bg-white 
          border border-gray-100 rounded-lg 
          hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        {user.image ? (
                          <img
                            src={getImageUrl(user.image)!}
                            alt=""
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <RiUserFill size={18} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-gray-800 text-sm">
                          {user.name}
                        </span>
                        <span className="truncate text-gray-400 text-xs">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-600 truncate">{user.contact}</div>
                    {/* <div className="text-gray-600 truncate">{user.role}</div> */}
                    <div className="text-gray-600 truncate">
                      {formatDate(user.date)}
                    </div>

                    <div className="flex items-center justify-end gap-1 w-[140px]">
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
                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
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

      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={totalNum}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
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
                  image: editUser.image,
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

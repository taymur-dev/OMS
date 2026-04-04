import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { AddSystemUser } from "../../Components/SystemUsersModal/AddSystemUser";
import { EditSystemUser } from "../../Components/SystemUsersModal/EditSystemUser";
import { ViewSystemUser } from "../../Components/SystemUsersModal/ViewSystemUser";

import { RiInboxArchiveLine, RiUserFill } from "react-icons/ri";

type UserType = {
  id: number;
  name: string;
  cnic: string;
  contact: string;
  email: string;
  role: string;
  roleId: string;
  image?: string;
};

interface SystemUsersProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const SystemUsers = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: SystemUsersProps) => {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [catchId, setCatchId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [viewUser, setViewUser] = useState<UserType | null>(null);
  const [modalTypeTooPen, setModalTypeTooPen] = useState<
    "ADD" | "UPDATE" | "DELETE" | "VIEW" | ""
  >("");

  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const handlerGetUsers = useCallback(async () => {
    dispatch(navigationStart());
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getSytemUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res?.data?.users || []);
      dispatch(navigationSuccess("System Users"));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch users",
      );
    }
  }, [token, dispatch]);

  useEffect(() => {
    document.title = "(OMS) SYSTEM USERS";
    handlerGetUsers();
  }, [handlerGetUsers]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setModalTypeTooPen("ADD");
    }
  }, [triggerModal]);

  if (loader) return <Loader />;

  // ✅ Image helper
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/${imagePath}`;
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(externalSearch.toLowerCase()) ||
      user.contact.includes(externalSearch),
  );

  const totalNum = filteredUsers.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleDeleteUser = async (id: number | null) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handlerGetUsers();
      toast.success("User deleted successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto] 
              bg-blue-400 text-white rounded-lg items-center font-bold
              text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span>Sr#</span>
              <span>Name & Email</span>
              <span>Contact</span>
              <span>Role</span>
              <span className="text-right pr-4">Actions</span>
            </div>
          </div>

          {/* Body */}
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
                    border border-gray-100 rounded-lg hover:bg-blue-50/30 shadow-sm"
                  >
                    {/* Sr */}
                    <span className="text-gray-500">
                      {startIndex + index + 1}
                    </span>

                    {/* ✅ Name + Image */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {user.image ? (
                          <img
                            src={getImageUrl(user.image)!}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <RiUserFill size={18} />
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* Contact */}
                    <span className="text-gray-600">{user.contact}</span>

                    {/* Role */}
                    <span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-bold uppercase">
                        {user.role}
                      </span>
                    </span>

                    {/* Actions */}
                    <div className="flex justify-end gap-1">
                      <ViewButton
                        handleView={() => {
                          setViewUser(user);
                          setModalTypeTooPen("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setEditUser(user);
                          setModalTypeTooPen("UPDATE");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(user.id);
                          setModalTypeTooPen("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={totalNum}
          pageSize={externalPageSize}
          handlePageClick={(p) => setPageNo(p)}
        />
      </div>

      {/* Modals */}
      {modalTypeTooPen === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setModalTypeTooPen("")}
          onClose={() => setModalTypeTooPen("")}
          onConfirm={() => handleDeleteUser(catchId)}
        />
      )}

      {modalTypeTooPen === "ADD" && (
        <AddSystemUser
          handlerGetUsers={handlerGetUsers}
          setModal={() => setModalTypeTooPen("")}
        />
      )}

      {modalTypeTooPen === "UPDATE" && editUser && (
        <EditSystemUser
          userData={editUser}
          handlerGetUsers={handlerGetUsers}
          setModal={() => {
            setEditUser(null);
            setModalTypeTooPen("");
          }}
        />
      )}

      {modalTypeTooPen === "VIEW" && viewUser && (
        <ViewSystemUser
          viewUser={viewUser}
          setIsOpenModal={() => {
            setViewUser(null);
            setModalTypeTooPen("");
          }}
        />
      )}
    </div>
  );
};

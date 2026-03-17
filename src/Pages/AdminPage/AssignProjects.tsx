import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { AddAssignProject } from "../../Components/AssignProjectModal/AddAssignProject";
import { ViewAssignProject } from "../../Components/AssignProjectModal/ViewAssignProject";

import { RiInboxArchiveLine } from "react-icons/ri";

export type ALLASSIGNPROJECTT = {
  id: number;
  employee_id: number;
  name: string;
  projectName: string;
  projectId: number;
  date: string;
};

export type USERT = {
  id: number;
  name: string;
  email: string;
  role: string;
  loginStatus: string;
};

interface AssignProjectsProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

// ... (previous imports)

export const AssignProjects = ({
  triggerModal, // <--- Used in useEffect below
  externalSearch,
  externalPageSize,
}: AssignProjectsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const isAdmin = currentUser?.role === "admin"; 
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState<USERT[]>([]);
  const [selectedUser, setSelectedUser] = useState<USERT | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<"ADD" | "VIEW" | "">("");
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  const handleFetchActiveUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const activeOnes = res.data.users.filter((u: USERT) => u.loginStatus === 'Y');
      setAllUsers(activeOnes);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [token]);

  useEffect(() => {
    handleFetchActiveUsers();
    document.title = "(OMS) ASSIGN PROJECTS";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Assign project"));
    }, 500);
  }, [dispatch, handleFetchActiveUsers]);

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(externalSearch.toLowerCase())
  );

  const totalNum = filteredUsers.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + externalPageSize);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          <div className="px-0.5 pt-0.5">
            <div className={`grid grid-cols-[60px_1fr_1fr_1fr_auto] ${isAdmin ? "bg-blue-400" : "bg-blue-400"} text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}>
              <span className="text-left">Sr#</span>
              <span className="text-left">Employee Name</span>
              <span className="text-left">Email</span>
              <span className="text-left">Role</span>
              <span className="text-right w-[140px]">Actions</span>
            </div>
          </div>

          <div className="px-0.5 py-2">
            {paginatedUsers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No users found!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedUsers.map((user, index) => (
                  <div key={user.id} className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm">
                    <span className="text-gray-500 font-medium">{startIndex + index + 1}</span>
                    <span className="text-gray-600 font-medium">{user.name}</span>
                    <span className="text-gray-600 truncate">{user.email}</span>
                    <span className="text-gray-600">{user.role}</span>
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setSelectedUser(user);
                          setIsOpenModal("VIEW");
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

      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() => startIndex + externalPageSize < totalNum && setPageNo((p) => p + 1)}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddAssignProject
          setModal={() => setIsOpenModal("")}
          handleGetAllAssignProjects={handleFetchActiveUsers}
        />
      )}

      {isOpenModal === "VIEW" && selectedUser && (
        <ViewAssignProject
          setIsOpenModal={() => {
            setIsOpenModal("");
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </div>
  );
};
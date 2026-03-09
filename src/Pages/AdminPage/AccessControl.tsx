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
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { AddAccessControl } from "../../Components/AccessControlModal/AddAccessControl";
import { EditAccessControl } from "../../Components/AccessControlModal/EditAccessControl";

type RoleType = {
  id: number;
  roleName: string;
};

interface AccessControlData {
  moduleId: number;
  moduleName: string;
  status: number | boolean;
}

interface AccessControlProps {
  externalSearch: string;
  externalPageSize: number;
  triggerModal: number;
}

export const AccessControl = ({
  externalSearch,
  externalPageSize,
  triggerModal,
}: AccessControlProps) => {
  const [allRoles, setAllRoles] = useState<RoleType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [permissions, setPermissions] = useState<AccessControlData[]>([]);

  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const handlerGetRoles = useCallback(async () => {
    dispatch(navigationStart());
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getRoles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllRoles(res?.data?.roles || []);
      dispatch(navigationSuccess("Access Control"));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to fetch roles",
      );
    }
  }, [token, dispatch]);


  const handlerGetAccessControl = useCallback(
    async (role: RoleType) => {
      dispatch(navigationStart());
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/getAccessControl/${role.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setPermissions(res?.data?.permissions || []);
        setSelectedRole(role);
        setIsEditMode(true);

        dispatch(navigationSuccess("Permissions Loaded"));
      } catch (error) {
        console.log(error);
      }
    },
    [token, dispatch],
  );

  useEffect(() => {
    document.title = "(OMS) ACCESS CONTROL";
    handlerGetRoles();
  }, [handlerGetRoles]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsAddMode(true);
    }
  }, [triggerModal]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  if (loader) return <Loader />;

  const filteredRoles = allRoles.filter((role) =>
    role.roleName.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredRoles.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[800px]">
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_120px] 
              bg-blue-400 text-white rounded-lg items-center font-bold
              text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span>Sr#</span>
              <span>Role</span>
              <span className="text-center">Action</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2">
            {paginatedRoles.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No roles found for access management.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedRoles.map((role, index) => (
                  <div
                    key={role.id}
                    className="grid grid-cols-[60px_1fr_120px]
                    items-center px-3 py-2 gap-3 text-sm bg-white 
                    border border-gray-100 rounded-lg 
                    hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <span className="truncate text-gray-800">
                      {role.roleName}
                    </span>

                    <div className="flex items-center justify-center">
                      <EditButton
                        handleUpdate={() => handlerGetAccessControl(role)}
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
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {isAddMode && (
        <AddAccessControl
          onClose={() => setIsAddMode(false)}
          onSuccess={handlerGetRoles}
        />
      )}

      {isEditMode && selectedRole && (
        <EditAccessControl
          key={selectedRole.id}
          role={selectedRole}
          initialPermissions={permissions}
          onClose={() => setIsEditMode(false)}
          onSuccess={handlerGetRoles}
        />
      )}
    </div>
  );
};

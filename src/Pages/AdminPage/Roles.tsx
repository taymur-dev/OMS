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
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { AddRole } from "../../Components/Roles/AddRole";
import { EditRole } from "../../Components/Roles/EditRole";
import { RiInboxArchiveLine } from "react-icons/ri";


type RoleType = {
  id: number;
  roleName: string;
};

interface RolesProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Roles = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: RolesProps) => {
  const [allRoles, setAllRoles] = useState<RoleType[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [catchId, setCatchId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<RoleType | null>(null);
  const [modalTypeTooPen, setModalTypeTooPen] = useState<
    "ADD" | "UPDATE" | "DELETE" | ""
  >("");

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
      dispatch(navigationSuccess("Roles"));
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message);
    }
  }, [token, dispatch]);

  useEffect(() => {
    document.title = "(OMS) ALL ROLES";
    handlerGetRoles();
  }, [handlerGetRoles]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setModalTypeTooPen("ADD");
    }
  }, [triggerModal]);

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

  const handleDeleteRole = async (id: number | null) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteRole/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handlerGetRoles();
      toast.success("Role deleted successfully");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_auto] 
              bg-blue-400 text-white rounded-lg items-center font-bold
              text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span>Sr#</span>
              <span>Role Name</span>
              <span className="text-right w-[120px] pr-4">Actions</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2">
            {paginatedRoles.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">
                  Try adjusting your date range or search term.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedRoles.map((role, index) => (
                  <div
                    key={role.id}
                    className="grid grid-cols-[60px_1fr_auto]
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

                    <div className="flex items-center justify-end gap-1 w-[120px]">
                      <EditButton
                        handleUpdate={() => {
                          setEditRole(role);
                          setModalTypeTooPen("UPDATE");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(role.id);
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

      {modalTypeTooPen === "ADD" && (
        <AddRole
          handlerGetRoles={handlerGetRoles}
          setModal={() => setModalTypeTooPen("")}
        />
      )}

      {modalTypeTooPen === "UPDATE" && editRole && (
        <EditRole
          selectRole={editRole}
          getAllRoles={handlerGetRoles}
          setModal={() => {
            setEditRole(null);
            setModalTypeTooPen("");
          }}
        />
      )}

      {modalTypeTooPen === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setModalTypeTooPen("")}
          onClose={() => setModalTypeTooPen("")}
          onConfirm={() => handleDeleteRole(catchId)}
        />
      )}
    </div>
  );
};

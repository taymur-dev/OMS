import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { RiInboxArchiveLine, RiContactsBookLine } from "react-icons/ri";

// Project Imports
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

// UI Components
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

// Note: You will need to create these specific modals or repurpose existing ones
import { AddBusinessVariable } from "../../Components/BusinessVariableModal/AddBusinessVariable";
import { EditBusinessVariable } from "../../Components/BusinessVariableModal/EditBusinessVariable";
import { ViewBusinessVariable } from "../../Components/BusinessVariableModal/ViewBusinessVariable";

type ModalStateT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export interface BusinessVarType {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  logo?: string; // URL or base64 string
}

interface BusinessVariablesProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
  setHasBusinessVariable: (value: boolean) => void;
}

export const BusinessVariables = ({
  triggerModal,
  externalSearch,
  externalPageSize,
  setHasBusinessVariable,
}: BusinessVariablesProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ModalStateT>("");
  const [pageNo, setPageNo] = useState(1);
  const [businessVars, setBusinessVars] = useState<BusinessVarType[]>([]);
  const [selectedItem, setSelectedItem] = useState<BusinessVarType | null>(
    null,
  );
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const fetchBusinessData = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/business-variables`);
      setBusinessVars(res.data);
      setHasBusinessVariable(res.data.length > 0);
    } catch (err) {
      console.error("Failed to fetch business variables:", err);
    }
  }, [setHasBusinessVariable]);

  useEffect(() => {
    document.title = "(OMS) BUSINESS VARIABLES";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Business Variables"));
    }, 1000);
    fetchBusinessData();
  }, [dispatch, fetchBusinessData]);

  // Reset pagination on search
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  // Trigger Add Modal from Parent
  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  const filteredData = businessVars.filter(
    (item) =>
      item.name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      item.email.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  // Pagination Logic
  const totalNum = filteredData.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleToggleModal = (type: ModalStateT) => setIsOpenModal(type);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/business-variables/${id}`);
      fetchBusinessData();
      setIsOpenModal("");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Table Header */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[60px_80px_1fr_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span>Sr#</span>
              <span>Logo</span>
              <span>Name</span>
              <span>Email</span>
              <span>Contact</span>
              <span>Address</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_80px_1fr_1fr_1fr_1fr_auto] items-center px-3 py-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Logo Column */}
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt="logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <RiContactsBookLine className="text-gray-400" />
                      )}
                    </div>

                    <div className="truncate font-semibold text-gray-800">
                      {item.name}
                    </div>
                    <div className="truncate text-gray-600">{item.email}</div>
                    <div className="truncate text-gray-600">{item.contact}</div>

                    <div className="truncate text-gray-600">{item.address}</div>

                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setSelectedItem(item);
                          handleToggleModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectedItem(item);
                          handleToggleModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setItemToDelete(item.id);
                          handleToggleModal("DELETE");
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

      {/* Pagination Footer */}
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

      {/* ADD MODAL */}
      {isOpenModal === "ADD" && (
        <AddBusinessVariable
          setModal={() => handleToggleModal("")}
          handleRefresh={fetchBusinessData}
        />
      )}

      {/* EDIT MODAL */}
      {isOpenModal === "EDIT" && selectedItem && (
        <EditBusinessVariable
          setModal={() => handleToggleModal("")}
          refreshAssets={fetchBusinessData}
          businessData={selectedItem}
        />
      )}

      {isOpenModal === "DELETE" && itemToDelete !== null && (
        <ConfirmationModal
          isOpen={() => handleToggleModal("")}
          onClose={() => handleToggleModal("")}
          onConfirm={() => handleDelete(itemToDelete)}
          // Updated message to reflect soft delete
          message="Are you sure you want to remove this record? This action can be undone by an administrator."
        />
      )}

      {isOpenModal === "VIEW" && (
        <ViewBusinessVariable
          viewData={selectedItem}
          setModal={() => handleToggleModal("")}
        />
      )}
    </div>
  );
};

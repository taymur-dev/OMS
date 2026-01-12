import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

import { AddResignation } from "../../Components/ResignationModal/AddResignation";
import { UpdateResignation } from "../../Components/ResignationModal/UpdateResignation";
import { ViewResignation } from "../../Components/ResignationModal/ViewResignation";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type ResignationT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export type ResignationDataT = {
  id: number;
  employee_name: string;
  designation: string;
  resignation_date: string;
  note: string;
  approval_status: string;
};

export const Resignation = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<ResignationT>("");
  const [allResignations, setAllResignations] = useState<ResignationDataT[]>(
    []
  );
  const [selectedResignation, setSelectedResignation] =
    useState<ResignationDataT | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleViewModal = (active: ResignationT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleViewClick = (resignation: ResignationDataT) => {
    setSelectedResignation(resignation);
    handleToggleViewModal("VIEW");
  };

  const handleEditClick = (resignation: ResignationDataT) => {
    setSelectedResignation(resignation);
    handleToggleViewModal("EDIT");
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => Math.max(prev - 1, 1));

  const handleGetAllResignations = useCallback(
    async (updatedItem?: ResignationDataT) => {
      if (!token || !currentUser) return;

      try {
        const url =
          currentUser.role === "admin"
            ? `${BASE_URL}/api/admin/getResignations`
            : `${BASE_URL}/api/user/getMyResignations`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data: ResignationDataT[] = Array.isArray(res.data) ? res.data : [];

        if (updatedItem) {
          data = data.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
          );
        }

        setAllResignations(data.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Failed to fetch resignations:", error);
        setAllResignations([]);
      }
    },
    [token, currentUser]
  );

  const handleDeleteResignation = async () => {
    if (!selectedId || !token) return;

    try {
      await axios.delete(`${BASE_URL}/api/deleteResignation/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleGetAllResignations();
      setIsOpenModal("");
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete resignation:", error);
    }
  };

  const filteredResignations = allResignations.filter(
    (res) =>
      res.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredResignations.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedResignations = filteredResignations.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    handleGetAllResignations();
    document.title = "(OMS) RESIGNATIONS";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Resignation Request")), 500);
  }, [dispatch, handleGetAllResignations]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Resignation Request"
        activeFile="Resignation Request list"
      />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
       overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Resignations:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{totalItems}]
            </span>
          </span>

          <CustomButton
            label="Add Resignation"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
                {numbers.map((num) => (
                  <option key={num} value={num}>
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
            className="grid grid-cols-6 bg-gray-200 text-gray-900 font-semibold border border-gray-600
           text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Designation</span>
            <span>Resignation Date</span>
            <span>Approval</span>
            <span className="text-center w-40">Actions</span>
          </div>

          {paginatedResignations.map((res, index) => (
            <div
              key={res.id}
              className="grid grid-cols-6 border border-gray-600 text-gray-800 hover:bg-gray-100 transition 
              duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span className="px-2">{startIndex + index + 1}</span>
              <span>{res.employee_name}</span>
              <span>{res.designation}</span>
              <span>
                {new Date(res.resignation_date).toLocaleDateString("en-CA")}
              </span>
              <span>{res.approval_status}</span>
              <span className="flex items-center gap-1">
                <EditButton handleUpdate={() => handleEditClick(res)} />
                <ViewButton handleView={() => handleViewClick(res)} />
                <DeleteButton
                  handleDelete={() => {
                    setSelectedId(res.id);
                    handleToggleViewModal("DELETE");
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          end={endIndex}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddResignation
          setModal={() => handleToggleViewModal("")}
          handleRefresh={handleGetAllResignations}
        />
      )}

      {isOpenModal === "EDIT" && selectedResignation && (
        <UpdateResignation
          setModal={() => handleToggleViewModal("")}
          resignationData={{
            id: String(selectedResignation.id),
            employee_name: selectedResignation.employee_name,
            designation: selectedResignation.designation,
            note: selectedResignation.note,
            date: selectedResignation.resignation_date,
            approval_status: selectedResignation.approval_status,
          }}
          handleRefresh={handleGetAllResignations}
        />
      )}

      {isOpenModal === "VIEW" && selectedResignation && (
        <ViewResignation
          setModal={() => handleToggleViewModal("")}
          resignationData={{
            employee_name: selectedResignation.employee_name,
            designation: selectedResignation.designation,
            note: "",
            resignation_date: selectedResignation.resignation_date,
            approval_status: selectedResignation.approval_status,
          }}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteResignation}
          message="Are you sure you want to delete this Resignation?"
        />
      )}
    </div>
  );
};

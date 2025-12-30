import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { AddApplicant } from "../../Components/ApplicantsModal/AddApplicant";
import { UpdateApplicant } from "../../Components/ApplicantsModal/UpdateApplicant";
import { ViewApplicant } from "../../Components/ApplicantsModal/ViewApplicant";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

type ApplicantT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

export interface Applicant {
  id: number;
  applicant_name: string;
  applicant_contact: string;
  applied_date: string;
  job: string;
  status: "pending" | "approved" | "rejected";
}

const pageSizes = [10, 25, 50, 100];

export const Applicants = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ApplicantT>("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null
  );

  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleViewModal = (active: ApplicantT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const fetchApplicants = useCallback(async () => {
    try {
      dispatch(navigationStart());

      const res = await axios.get(`${BASE_URL}/api/admin/getapplicants`, {
        params: {
          page: pageNo,
          limit: limit,
        },
      });

      const sortedApplicants = res.data.data.sort(
        (a: Applicant, b: Applicant) => a.id - b.id
      );

      setApplicants(sortedApplicants);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch applicants", error);
    } finally {
      dispatch(navigationSuccess("APPLICATION"));
    }
  }, [dispatch, pageNo, limit]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  useEffect(() => {
    document.title = "(OMS) APPLICATION";
  }, []);

  const filteredApplicants = useMemo(() => {
    return applicants
      .filter((app) =>
        `${app.applicant_name} ${app.job} ${app.status}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.id - b.id);
  }, [applicants, searchTerm]);

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleDeleteApplicant = async () => {
    if (!selectedApplicantId) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteapplicant/${selectedApplicantId}`
      );
      setApplicants((prev) =>
        prev.filter((item) => item.id !== selectedApplicantId)
      );
      setTotal((prev) => prev - 1);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setSelectedApplicantId(null);
      handleToggleViewModal("");
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Applicants" activeFile="Applicants list" />

      <div className="shadow-lg border-t-2 rounded border-indigo-500 bg-white flex flex-col">
        <div className="flex items-center justify-between mx-2 py-2">
          <span>
            Total Applicants:{" "}
            <span className="text-2xl text-blue-500 font-semibold">
              {total}
            </span>
          </span>
          <CustomButton
            label="Add Applicant"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between mx-2 py-2">
          <div>
            Show{" "}
            <select
              className="mx-2 p-1 border rounded"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPageNo(1);
              }}
            >
              {pageSizes.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            entries
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="overflow-y-auto max-h-[28rem]">
          <div className="grid grid-cols-7 bg-gray-200 font-semibold p-2 sticky top-0">
            <span>Sr#</span>
            <span>Name</span>
            <span>Contact</span>
            <span>Date Applied</span>
            <span>Job</span>
            <span className="text-center">Status</span>
            <span className="text-center">Actions</span>
          </div>

          {filteredApplicants.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-7 border p-2 hover:bg-gray-100 text-sm items-center"
            >
              <span>{(pageNo - 1) * limit + index + 1}</span>
              <span>{item.applicant_name}</span>
              <span>{item.applicant_contact}</span>
              <span>{new Date(item.applied_date).toLocaleDateString()}</span>
              <span>{item.job}</span>
              <span className="text-center">
                <span
                  className={`p-2 rounded-full text-xs font-semibold
                    ${
                      item.status === "pending" &&
                      "bg-orange-100 text-orange-600"
                    }
                    ${
                      item.status === "approved" &&
                      "bg-green-100 text-green-600"
                    }
                    ${item.status === "rejected" && "bg-red-100 text-red-600"}`}
                >
                  {item.status}
                </span>
              </span>
              <span className="flex justify-center gap-1">
                <EditButton
                  handleUpdate={() => {
                    setSelectedApplicant(item);
                    handleToggleViewModal("EDIT");
                  }}
                />

                <ViewButton
                  handleView={() => {
                    setSelectedApplicant(item);
                    handleToggleViewModal("VIEW");
                  }}
                />
                <DeleteButton
                  handleDelete={() => {
                    setSelectedApplicantId(item.id);
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
          start={(pageNo - 1) * limit + 1}
          end={Math.min(pageNo * limit, total)}
          total={total}
        />
        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddApplicant
          setModal={() => {
            handleToggleViewModal("");
            fetchApplicants();
          }}
          refreshApplicants={fetchApplicants}
        />
      )}
      {isOpenModal === "EDIT" && selectedApplicant && (
        <UpdateApplicant
          setModal={() => handleToggleViewModal("")}
          applicant={selectedApplicant}
          refreshApplicants={fetchApplicants}
        />
      )}
      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteApplicant}
          message="Are you sure you want to delete this Applicant?"
        />
      )}

      {isOpenModal === "VIEW" && selectedApplicant && (
        <ViewApplicant
          applicant={selectedApplicant}
          setModal={() => handleToggleViewModal("")}
        />
      )}
    </div>
  );
};

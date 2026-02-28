import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { AddApplicant } from "../../Components/ApplicantsModal/AddApplicant";
import { UpdateApplicant } from "../../Components/ApplicantsModal/UpdateApplicant";
import { ViewApplicant } from "../../Components/ApplicantsModal/ViewApplicant";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { toast } from "react-toastify";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Briefcase, Calendar, Archive } from "lucide-react";

import { RiUserFill } from "react-icons/ri";

import { RiCloseCircleLine , RiCheckboxCircleLine , RiTimerLine } from "react-icons/ri";

type ApplicantT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

export interface Applicant {
  id: number;
  applicant_name: string;
  applicant_contact: string;
  applied_date: string;
  job: string;
  status: "pending" | "approved" | "rejected";
}

interface ApplicantsProps {
  triggerRecruit: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Applicants = ({
  triggerRecruit,
  externalSearch,
  externalPageSize,
}: ApplicantsProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ApplicantT>("");
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null,
  );

  const [pageNo, setPageNo] = useState(1);

  const handleToggleViewModal = (active: ApplicantT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const fetchApplicants = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getapplicants`);
      // Since UsersDetails handles filtering/pagination on the frontend, we fetch all here
      setApplicants(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch applicants", error);
    } finally {
      dispatch(navigationSuccess("APPLICATION"));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerRecruit > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerRecruit]);

  useEffect(() => {
    document.title = "(OMS) APPLICATION";
  }, []);

  // Filter and Sort logic matching UsersDetails style
  const filteredApplicants = applicants
    .filter(
      (app) =>
        app.applicant_name
          .toLowerCase()
          .includes(externalSearch.toLowerCase()) ||
        app.job.toLowerCase().includes(externalSearch.toLowerCase()) ||
        app.applicant_contact.includes(externalSearch) ||
        app.status.toLowerCase().includes(externalSearch.toLowerCase()),
    )
    .sort((a, b) => a.id - b.id);

  const totalNum = filteredApplicants.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handleDeleteApplicant = async () => {
    if (!selectedApplicantId) return;
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteapplicant/${selectedApplicantId}`,
      );
      fetchApplicants();
      toast.success("Applicant deleted successfully");
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setSelectedApplicantId(null);
      handleToggleViewModal("");
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="px-4 pt-0.5">
            <div className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span>Sr#</span>
              <span>Name & Contact</span>
              <span>Job Role</span>
              <span>Status</span>
              <span>Date Applied</span>
              <span className="text-right pr-10">Actions</span>
            </div>
          </div>

          {/* Data Rows */}
          <div className="px-4 py-2">
            {paginatedApplicants.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <Archive size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedApplicants.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_auto] items-center p-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium pl-2">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                        <RiUserFill size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-gray-800">
                          {item.applicant_name}
                        </span>

                        <span className="truncate font-sm text-gray-400">{item.applicant_contact}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="text-yellow-400" size={14} />
                      <span className="truncate">{item.job}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      {/* Dynamic Icon based on status */}
                      {item.status === "approved" ? (
                        <RiCheckboxCircleLine
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                      ) : item.status === "pending" ? (
                        <RiTimerLine
                          className="text-orange-500 flex-shrink-0"
                          size={16}
                        />
                      ) : (
                        <RiCloseCircleLine
                          className="text-red-500 flex-shrink-0"
                          size={16}
                        />
                      )}

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "approved"
                            ? "text-green-500"
                            : item.status === "pending"
                              ? "text-orange-500"
                              : "text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="text-blue-400" size={14} />
                      <span>
                        {new Date(item.applied_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => {
                          setSelectedApplicant(item);
                          handleToggleViewModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectedApplicant(item);
                          handleToggleViewModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedApplicantId(item.id);
                          handleToggleViewModal("DELETE");
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

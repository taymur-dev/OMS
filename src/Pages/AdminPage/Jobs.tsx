import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddJob } from "../../Components/JobModal/AddJob";
import { UpdateJob } from "../../Components/JobModal/UpdateJob";
import { ViewJob } from "../../Components/JobModal/ViewJob";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";
import { RiInboxArchiveLine, RiBriefcaseLine } from "react-icons/ri";

type ModalT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";
type Job = {
  id: number;
  job_title: string;
  description: string;
  addedBy?: string;
  date?: string;
};

interface JobsProps {
  triggerRecruit: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Jobs = ({ triggerRecruit, externalSearch, externalPageSize }: JobsProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ModalT>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const handleToggleModal = (active: ModalT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const getJobs = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getjob`);
      setJobs(res.data.data.sort((a: Job, b: Job) => a.id - b.id));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("JOBS"));
    }
  }, [dispatch]);

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    try {
      dispatch(navigationStart());
      await axios.patch(`${BASE_URL}/api/admin/deletejob/${selectedJob.id}`);
      getJobs();
      handleToggleModal("");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("JOBS"));
    }
  };

  useEffect(() => {
    document.title = "(OMS) JOBS";
    getJobs();
  }, [getJobs]);

  useEffect(() => {
    if (triggerRecruit > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerRecruit]);

  // Reset pagination when filters change
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) =>
        job.job_title.toLowerCase().includes(externalSearch.toLowerCase())
      )
      .sort((a, b) => a.id - b.id);
  }, [jobs, externalSearch]);

  const totalNum = filteredJobs.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };
  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[600px]">
          {/* Header Section aligned with UsersDetails */}
          <div className="px-4 pt-0.5">
            <div
              className="grid grid-cols-3 
              bg-blue-400 text-white rounded-lg items-center font-bold
              text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Job Title</span>
              <span className="text-right pr-10">Actions</span>
            </div>
          </div>

          {/* Table Body Section */}
          <div className="px-4 py-2">
            {paginatedJobs.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available at the moment!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-3 
                    items-center p-1 gap-3 text-sm bg-white 
                    border border-gray-100 rounded-lg 
                    hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium pl-2">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0">
                        <RiBriefcaseLine size={20} />
                      </div>
                      <span className="truncate font-semibold text-gray-800">
                        {job.job_title}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => {
                          setSelectedJob(job);
                          handleToggleModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setSelectedJob(job);
                          handleToggleModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedJob(job);
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

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddJob setModal={() => handleToggleModal("")} refreshJobs={getJobs} existingJobs={jobs} />
      )}

      {isOpenModal === "EDIT" && selectedJob && (
        <UpdateJob
          job={selectedJob}
          setModal={() => handleToggleModal("")}
          refreshJobs={getJobs}
          existingJobs={jobs}
        />
      )}

      {isOpenModal === "VIEW" && selectedJob && (
        <ViewJob setIsOpenModal={() => handleToggleModal("")} viewJob={selectedJob} />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleModal("")}
          onClose={() => handleToggleModal("")}
          onConfirm={handleDeleteJob}
          message="Are you sure you want to delete this job?"
        />
      )}
    </div>
  );
};
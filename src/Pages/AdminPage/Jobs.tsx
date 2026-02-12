import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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
import { Footer } from "../../Components/Footer";

type ModalT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";
type Job = {
  id: number;
  job_title: string;
  description: string;
  addedBy?: string;
  date?: string;
};

const pageSizes = [5, 10, 20, 50];

export const Jobs = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<ModalT>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) =>
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.id - b.id);
  }, [jobs, searchTerm]);

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);
  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  if (loader) return <Loader />;

 

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Job button */}
        <TableTitle
          tileName="Jobs"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleModal("ADD")}
              label="+ Add Job"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {pageSizes.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[600px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-3 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Job Title</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {filteredJobs.slice((pageNo - 1) * limit, pageNo * limit).length ===
            0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              filteredJobs
                .slice((pageNo - 1) * limit, pageNo * limit)
                .map((job, index) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-3 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * limit + index + 1}</span>
                    <span className="truncate font-medium">
                      {job.job_title}
                    </span>
                    <span className="flex flex-nowrap justify-center gap-1">
                      <EditButton
                        handleUpdate={() => {
                          setSelectedJob(job);
                          handleToggleModal("EDIT");
                        }}
                      />
                      <ViewButton
                        handleView={() => {
                          setSelectedJob(job);
                          handleToggleModal("VIEW");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedJob(job);
                          handleToggleModal("DELETE");
                        }}
                      />
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={filteredJobs.length === 0 ? 0 : (pageNo - 1) * limit + 1}
            end={Math.min(pageNo * limit, filteredJobs.length)}
            total={filteredJobs.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
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
        <ViewJob
          setIsOpenModal={() => handleToggleModal("")}
          viewJob={selectedJob}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleModal("")}
          onClose={() => handleToggleModal("")}
          onConfirm={handleDeleteJob}
          message="Are you sure you want to delete this job?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

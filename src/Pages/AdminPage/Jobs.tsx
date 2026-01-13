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
  const [totalJobs, setTotalJobs] = useState(0);

  const handleToggleModal = (active: ModalT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const getJobs = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getjob`);
      setJobs(res.data.data.sort((a: Job, b: Job) => a.id - b.id));
      setTotalJobs(res.data.data.length);
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
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.id - b.id);
  }, [jobs, searchTerm]);

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);
  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Jobs" activeFile="Jobs list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white flex flex-col">
        <div className="flex items-center justify-between mx-2 py-2">
          <span>
            Total number of Jobs :
            <span className="text-2xl text-blue-500 font-semibold">
              [{totalJobs}]
            </span>
          </span>

          <CustomButton
            label="Add Job"
            handleToggle={() => handleToggleModal("ADD")}
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

        <div className="overflow-y-auto mx-2">
          <div className="grid grid-cols-4 bg-gray-200 font-semibold text-sm p-3 sticky top-0">
            <span>Sr#</span>
            <span>Job Title</span>
            <span className="text-center">Actions</span>
          </div>

          {filteredJobs
            .slice((pageNo - 1) * limit, pageNo * limit)
            .map((job, index) => (
              <div
                key={job.id}
                className="grid grid-cols-4 text-sm border-b p-2 items-center hover:bg-gray-50"
              >
                <span>{(pageNo - 1) * limit + index + 1}</span>
                <span className="font-medium">{job.job_title}</span>
                <span className="flex justify-center gap-2">
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
            ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <ShowDataNumber
          start={(pageNo - 1) * limit + 1}
          end={Math.min(pageNo * limit, filteredJobs.length)}
          total={filteredJobs.length}
        />

        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddJob setModal={() => handleToggleModal("")} refreshJobs={getJobs} />
      )}

      {isOpenModal === "EDIT" && selectedJob && (
        <UpdateJob
          job={selectedJob}
          setModal={() => handleToggleModal("")}
          refreshJobs={getJobs}
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
          onClose={() => handleToggleModal("DELETE")}
          onConfirm={handleDeleteJob}
          message="Are you sure you want to delete this job?"
        />
      )}
    </div>
  );
};

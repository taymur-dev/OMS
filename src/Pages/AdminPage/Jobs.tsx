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
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.id - b.id);
  }, [jobs, searchTerm]);

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);
  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle tileName="Jobs" activeFile="Jobs list" />

  //     <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white flex flex-col">
  //       <div className="flex items-center justify-between mx-2 py-2">
  //         <span>
  //           Total number of Jobs :
  //           <span className="text-2xl text-indigo-900 font-semibold">
  //             [{totalJobs}]
  //           </span>
  //         </span>

  //         <CustomButton
  //           label="Add Job"
  //           handleToggle={() => handleToggleModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between mx-2 py-2">
  //         <div>
  //           Show{" "}
  //           <select
  //             className="mx-2 p-1 border rounded"
  //             value={limit}
  //             onChange={(e) => {
  //               setLimit(Number(e.target.value));
  //               setPageNo(1);
  //             }}
  //           >
  //             {pageSizes.map((num) => (
  //               <option key={num} value={num}>
  //                 {num}
  //               </option>
  //             ))}
  //           </select>
  //           entries
  //         </div>

  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="overflow-y-auto mx-2">
  //         <div className="grid grid-cols-4 bg-indigo-900 text-white font-semibold text-sm p-3 sticky top-0">
  //           <span>Sr#</span>
  //           <span>Job Title</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {filteredJobs
  //           .slice((pageNo - 1) * limit, pageNo * limit)
  //           .map((job, index) => (
  //             <div
  //               key={job.id}
  //               className="grid grid-cols-4 text-sm border-b p-2 items-center hover:bg-gray-50"
  //             >
  //               <span>{(pageNo - 1) * limit + index + 1}</span>
  //               <span className="font-medium">{job.job_title}</span>
  //               <span className="flex justify-center gap-2">
  //                 <EditButton
  //                   handleUpdate={() => {
  //                     setSelectedJob(job);
  //                     handleToggleModal("EDIT");
  //                   }}
  //                 />
  //                 <ViewButton
  //                   handleView={() => {
  //                     setSelectedJob(job);
  //                     handleToggleModal("VIEW");
  //                   }}
  //                 />
  //                 <DeleteButton
  //                   handleDelete={() => {
  //                     setSelectedJob(job);
  //                     handleToggleModal("DELETE");
  //                   }}
  //                 />
  //               </span>
  //             </div>
  //           ))}
  //       </div>
  //     </div>

  //     <div className="flex justify-between mt-2">
  //       <ShowDataNumber
  //         start={(pageNo - 1) * limit + 1}
  //         end={Math.min(pageNo * limit, filteredJobs.length)}
  //         total={filteredJobs.length}
  //       />

  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //       />
  //     </div>

  //     {/* Modals */}
  //     {isOpenModal === "ADD" && (
  //       <AddJob setModal={() => handleToggleModal("")} refreshJobs={getJobs} />
  //     )}

  //     {isOpenModal === "EDIT" && selectedJob && (
  //       <UpdateJob
  //         job={selectedJob}
  //         setModal={() => handleToggleModal("")}
  //         refreshJobs={getJobs}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && selectedJob && (
  //       <ViewJob
  //         setIsOpenModal={() => handleToggleModal("")}
  //         viewJob={selectedJob}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && (
  //       <ConfirmationModal
  //         isOpen={() => handleToggleModal("")}
  //         onClose={() => handleToggleModal("DELETE")}
  //         onConfirm={handleDeleteJob}
  //         message="Are you sure you want to delete this job?"
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="w-full px-2 sm:px-4">
      <TableTitle tileName="Jobs" activeFile="Jobs list" />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total number of Jobs :
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              [{totalJobs}]
            </span>
          </span>

          <CustomButton
            label="Add Job"
            handleToggle={() => handleToggleModal("ADD")}
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm">
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPageNo(1);
                }}
                className="bg-transparent outline-none"
              >
                {pageSizes.map((num) => (
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

        {/* Table Wrapper */}
        <div className="mx-2 mt-2 overflow-x-auto overflow-y-auto max-h-[28.4rem]">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr] items-center sm:grid-cols-[0.5fr_2fr_2fr_1fr_1fr] bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span>Job Title</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {filteredJobs.slice((pageNo - 1) * limit, pageNo * limit).length ===
            0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No records available at the moment!
              </div>
            ) : (
              filteredJobs
                .slice((pageNo - 1) * limit, pageNo * limit)
                .map((job, index) => (
                  <div
                    key={job.id}
                    className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr] items-center sm:grid-cols-[0.5fr_2fr_2fr_1fr_1fr] border-b text-gray-800 text-sm p-2 items-center hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * limit + index + 1}</span>
                    <span className="truncate font-medium">
                      {job.job_title}
                    </span>
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
                ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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

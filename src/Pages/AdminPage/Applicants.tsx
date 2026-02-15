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
import { toast } from "react-toastify";


import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Footer } from "../../Components/Footer";

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
    null,
  );
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null,
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
        (a: Applicant, b: Applicant) => a.id - b.id,
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
          .includes(searchTerm.toLowerCase()),
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
        `${BASE_URL}/api/admin/deleteapplicant/${selectedApplicantId}`,
      );
      setApplicants((prev) =>
        prev.filter((item) => item.id !== selectedApplicantId),
      );
      setTotal((prev) => prev - 1);
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
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <TableTitle
          tileName="Applicants"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADD")}
              label="+ Add Applicant"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
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

            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            <div
              className="grid grid-cols-7 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Name</span>
              <span>Contact</span>
              <span>Date Applied</span>
              <span>Job</span>
              <span className="text-center">Status</span>
              <span className="text-center">Actions</span>
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              filteredApplicants.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-7 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * limit + index + 1}</span>
                  <span className="truncate">{item.applicant_name}</span>
                  <span>{item.applicant_contact}</span>
                  <span>
                    {new Date(item.applied_date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="truncate">{item.job}</span>
                  <span className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${item.status === "pending" && "bg-orange-600 text-white"}
                    ${item.status === "approved" && "bg-green-700 text-white"}
                    ${item.status === "rejected" && "bg-red-700 text-white"}`}
                    >
                      {item.status}
                    </span>
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
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
              ))
            )}
          </div>
        </div>

        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={
              filteredApplicants.length === 0 ? 0 : (pageNo - 1) * limit + 1
            }
            end={Math.min(pageNo * limit, total)}
            total={total}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
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

      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};

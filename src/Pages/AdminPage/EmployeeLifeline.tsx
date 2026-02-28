import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import toast, { Toaster } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { navigationStart, navigationSuccess } from "../../redux/NavigationSlice";

// Components
import { Loader } from "../../Components/LoaderComponent/Loader";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { AddEmployeeLifeLine } from "../../Components/EmpLifeLine/AddEmployeeLifeLine";
import { ViewEmployeeLifeLine } from "../../Components/EmpLifeLine/ViewEmployeeLifeLine";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";

// Icons
import { 
  RiUserFill, 
  RiPhoneLine, 
  RiBriefcaseLine, 
  RiCalendarLine, 
  RiInboxArchiveLine 
} from "react-icons/ri";

type LoanT = "ADD" | "VIEW" | "";

type LifeLine = {
  id: number;
  employeeName: string;
  email: string;
  contact: string;
  position: string;
  date: string;
  image?: string;
};

interface EmployeeLifelineProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

export const EmployeeLifeline = ({ 
  triggerAdd, 
  externalSearch, 
  externalPageSize 
}: EmployeeLifelineProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const token = useAppSelector((state) => state.officeState.currentUser?.token);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<LoanT>("");
  const [selectedEmployee, setSelectedEmployee] = useState<LifeLine | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);

  // UI Setup matching UsersDetails
  const gridTemplate = "grid-cols-6";

  const fetchLifelines = useCallback(async () => {
    dispatch(navigationStart());
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getEmpll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.data.sort((a: LifeLine, b: LifeLine) => a.id - b.id);
      setLifeLines(sorted);
      dispatch(navigationSuccess("Employee Lifeline"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lifelines");
    }
  }, [token, dispatch]);

  useEffect(() => {
    document.title = "(OMS) LifeLine";
    fetchLifelines();
  }, [fetchLifelines]);

  useEffect(() => {
    if (triggerAdd > 0) setIsOpenModal("ADD");
  }, [triggerAdd]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  // Filtering Logic
  const filteredLifeLines = lifeLines.filter((item) => {
    const search = externalSearch.toLowerCase();
    return (
      item.employeeName?.toLowerCase().includes(search) ||
      item.contact?.includes(search) ||
      item.position?.toLowerCase().includes(search) ||
      item.email?.toLowerCase().includes(search)
    );
  });

  const totalNum = filteredLifeLines.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedLifeLines = filteredLifeLines.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(totalNum / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="overflow-auto">
        <div className="min-w-[1000px]">
          {/* Header Section matching UsersDetails */}
          <div className="px-4 pt-0.5">
            <div className={`grid ${gridTemplate} bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}>
              <span className="text-left">Sr#</span>
              <span className="text-left">Employee & Email</span>
              <span className="text-left">Contact</span>
              <span className="text-left">Position</span>
              <span className="text-left">Date</span>
              <span className="text-right">Actions</span>
            </div>
          </div>

          {/* Body Section */}
          <div className="px-4 py-2">
            {paginatedLifeLines.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedLifeLines.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid ${gridTemplate} items-center p-1 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium ml-2">
                      {startIndex + index + 1}
                    </span>

                    {/* Name & Avatar */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white flex-shrink-0 border-2 border-gray-100 shadow-sm">
                        {item.image ? (
                          <img src={`${BASE_URL}/${item.image}`} alt="" className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <RiUserFill size={20} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-gray-800">{item.employeeName}</span>
                        <span className="truncate text-gray-400 text-xs">{item.email}</span>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiPhoneLine className="text-green-400 flex-shrink-0" size={14} />
                      <span>{item.contact}</span>
                    </div>

                    {/* Position */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiBriefcaseLine className="text-yellow-400 flex-shrink-0" size={14} />
                      <span>{item.position}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <RiCalendarLine className="text-blue-400 flex-shrink-0" size={14} />
                      <span>{formatDate(item.date)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => {
                          setSelectedEmployee(item);
                          setIsOpenModal("VIEW");
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
      <div className="flex flex-row items-center justify-between py-4 px-4">
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
        <AddEmployeeLifeLine
          setModal={() => setIsOpenModal("")}
          onAdd={() => {
            fetchLifelines();
            setIsOpenModal("");
          }}
          existingLifeLines={lifeLines}
        />
      )}

      {isOpenModal === "VIEW" && selectedEmployee && (
        <ViewEmployeeLifeLine
          setIsOpenModal={() => setIsOpenModal("")}
          employeeData={selectedEmployee}
        />
      )}
    </div>
  );
};
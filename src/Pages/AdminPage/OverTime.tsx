import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddOverTime } from "../../Components/OvertimeModals/AddOvertime";
import { ViewOverTimeModal } from "../../Components/OvertimeModals/ViewOverTime";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { RiInboxArchiveLine } from "react-icons/ri";

type OVERTIMET = {
  id: number;
  employee_id: number;
  name: string;
  date: string;
  time: string;
  overtime_amount: string;
  description: string;
};

type MODALT = "ADD" | "VIEW" | "";

interface OverTimeProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const OverTime = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: OverTimeProps) => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<MODALT>("");
  const [allOvertime, setAllOvertime] = useState<OVERTIMET[]>([]);
  const [viewOvertime, setViewOvertime] = useState<OVERTIMET | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const handleGetOvertime = useCallback(async () => {
    if (!currentUser) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/getOvertime`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedData = (res.data || []).sort(
        (a: OVERTIMET, b: OVERTIMET) => a.id - b.id,
      );

      setAllOvertime(sortedData);
    } catch (error) {
      console.error("Error fetching overtime:", error);
      setAllOvertime([]);
    }
  }, [currentUser, token]);

  useEffect(() => {
    document.title = "(OMS) OVER TIME";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("OVER TIME")), 1000);
    handleGetOvertime();
  }, [dispatch, handleGetOvertime]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  const filteredOvertime = useMemo(() => {
    return allOvertime.filter((o) =>
      o.name.toLowerCase().includes(externalSearch.toLowerCase()),
    );
  }, [allOvertime, externalSearch]);

  const totalNum = filteredOvertime.length;
  const startIndex = (pageNo - 1) * externalPageSize;

  const paginatedOvertime = filteredOvertime.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          <div className="px-0.5 pt-0.5">
            <div
              className={`grid ${"grid-cols-[60px_1fr_1fr_1fr_1fr_auto]"} bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0
               z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span className="text-left">Sr#</span>

              <span className="text-left">Employee Details</span>

              <span className="text-left">Date</span>
              <span className="text-left">Over Time</span>
              <span className="text-left">OverTime Amount</span>
              <span className="text-right w-[120px] pr-4">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedOvertime.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedOvertime.map((ot, index) => (
                  <div
                    key={ot.id}
                    className={`grid ${"grid-cols-[60px_1fr_1fr_1fr_1fr_auto]"} items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg
                     hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="truncate text-gray-800">{ot.name}</span>
                    </div>

                    <div className="text-gray-600 truncate">
                      {new Date(ot.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </div>

                    <div className="text-gray-600 truncate">{ot.time}</div>

                    <div className="text-gray-600 font-medium">
                      {ot.overtime_amount}
                    </div>

                    <div className="flex items-center justify-end gap-1 w-[120px] pr-3">
                      <ViewButton
                        handleView={() => {
                          setViewOvertime(ot);
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

      {/* Pagination */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
        />

        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={() =>
            setPageNo((prev) =>
              Math.min(prev + 1, Math.ceil(totalNum / externalPageSize)),
            )
          }
          handleDecrementPageButton={() =>
            setPageNo((prev) => Math.max(prev - 1, 1))
          }
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddOverTime
          setModal={() => setIsOpenModal("")}
          refreshOvertime={handleGetOvertime}
        />
      )}

      {isOpenModal === "VIEW" && viewOvertime && (
        <ViewOverTimeModal
          setModal={() => setIsOpenModal("")}
          data={viewOvertime}
        />
      )}
    </div>
  );
};

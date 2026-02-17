import { useEffect, useState } from "react";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

interface CalendarSession {
  id?: number;
  session_name: string;
  year: string;
  month: string;
  calendarStatus?: string;
}

type ViewCalendarSessionProps = {
  setModal: () => void;
  selectedSession: {
    session_name: string;
    year: string;
    month: string;
    calendarStatus?: string;
  };
  allSessions: CalendarSession[]; // updated sessions from parent
};

export const ViewCalendarSession = ({
  setModal,
  selectedSession,
  allSessions,
}: ViewCalendarSessionProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [sessionsWithStatus, setSessionsWithStatus] = useState<CalendarSession[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        let resData: CalendarSession[] = [];

        if (allSessions && allSessions.length) {
          // Use updated sessions passed from parent
          resData = allSessions;
        } else {
          // fallback: fetch from API
          const res = await axios.get<CalendarSession[]>(
            `${BASE_URL}/api/admin/getCalendarSession`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          resData = res.data;
        }

        const filtered = resData
          .filter((s) => s.session_name === selectedSession.session_name)
          .sort(
            (a, b) =>
              new Date(`${a.month} 1, ${a.year}`).getTime() -
              new Date(`${b.month} 1, ${b.year}`).getTime()
          );

        setSessionsWithStatus(filtered);
      } catch (error) {
        console.error(error);
        // fallback to prop if API fails
        setSessionsWithStatus(
          allSessions.filter((s) => s.session_name === selectedSession.session_name)
        );
      }
    };

    fetchSessions();
  }, [selectedSession, token, allSessions]);

  if (!selectedSession) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden border border-indigo-900/20">
        {/* Header */}
        <div className="bg-indigo-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-bold tracking-wide uppercase">
            View Calendar Session
          </h2>
          <button
            onClick={setModal}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Session Info */}
        <div className="p-6 space-y-6">
          <div className="border border-gray-200 rounded-lg p-4 relative">
            <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-indigo-900 uppercase tracking-tighter">
              Session Information
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                  <span className="w-1 h-1 bg-indigo-900 rounded-full"></span>{" "}
                  Session Name
                </span>
                <span className="text-gray-800 font-medium text-lg">
                  {selectedSession.session_name}
                </span>
              </div>
            </div>
          </div>

          {/* Calendar Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-indigo-900 text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Sr#</th>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">Month</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessionsWithStatus.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-4 text-sm text-gray-800 font-medium">{item.year}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">{item.month}</td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.calendarStatus === "Active" || item.calendarStatus === "Processed"
                              ? "bg-green-500 text-white border-green-100"
                              : "bg-red-700 text-white border-red-100"
                          } border`}
                        >
                          {item.calendarStatus || "Not Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-indigo-900 px-6 py-4 flex justify-end">
          <CancelBtn setModal={setModal} />
        </div>
      </div>
    </div>
  );
};

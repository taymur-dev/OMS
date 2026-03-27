import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/Hooks";

interface LeaveNotification {
  id: number;
  name: string;
  leaveStatus: string;
  leaveSubject: string;
  fromDate: string;
  toDate: string;
}

interface NotificationDropdownProps {
  notifications: LeaveNotification[];
  onClose: () => void;
}

const NotificationDropdown = ({
  notifications,
  onClose,
}: NotificationDropdownProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state?.officeState);

  // Jab kisi specific notification par click ho
  const handleNotificationClick = (item: LeaveNotification) => {
    onClose();
    const role = currentUser?.role?.toLowerCase();

    // Determine the base path
    const basePath = role === "admin" ? "/attendance" : "/users/leaveRequests";

    // Navigate with tab and specific viewId
    // localhost:5173/attendance?tab=LEAVE&viewId=12
    navigate(`${basePath}?tab=LEAVE&viewId=${item.id}`);
  };

  const handleViewAll = () => {
    onClose();
    const role = currentUser?.role?.toLowerCase();
    if (role === "admin") {
      navigate("/attendance?tab=LEAVE");
    } else if (role === "user") {
      navigate("/users/leaveRequests");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>

      <div className="fixed md:absolute top-4 md:top-full left-1/2 md:left-auto right-auto md:right-0 -translate-x-1/2 md:translate-x-0 mt-0 md:mt-2 w-[90%] sm:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
        <div className="bg-blue-400 p-3">
          <h3 className="text-white font-semibold text-sm">Notifications</h3>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No new notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleNotificationClick(item)} // Yahan click handle hoga
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-gray-800">{item.name}</p>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.leaveStatus === "Approved"
                        ? "bg-green-100 text-green-700"
                        : item.leaveStatus === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.leaveStatus}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-1 truncate">
                  {item.leaveSubject}
                </p>

                <p className="text-[10px] text-gray-400 mt-1">
                  {(() => {
                    const from = item.fromDate.split("T")[0];
                    const to = item.toDate.split("T")[0];
                    return from === to ? from : `${from} - ${to}`;
                  })()}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
          <button
            onClick={handleViewAll}
            className="text-xs text-blue-400 font-semibold hover:underline w-full py-1"
          >
            View All Requests
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;

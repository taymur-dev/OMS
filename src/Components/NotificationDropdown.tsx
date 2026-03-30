import { useState, useEffect, useRef } from "react";
import { Bell, Calendar, Briefcase, LogOut, ChevronRight } from "lucide-react";

interface LeaveNotificationType {
  id: number;
  name: string;
  leaveStatus: string;
  leaveSubject: string;
  fromDate: string;
  toDate: string;
  type?: "leave";
}

interface PromotionNotificationType {
  id: number;
  employee_name: string;
  current_designation: string;
  requested_designation: string;
  approval: string;
  note: string;
  date: string;
  type?: "promotion";
}

interface ResignationNotificationType {
  id: number;
  employee_name: string;
  designation: string;
  resignation_date: string;
  note: string;
  approval_status: string;
  type?: "resignation";
}

type NotificationItem =
  | LeaveNotificationType
  | PromotionNotificationType
  | ResignationNotificationType;

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose: () => void;
  setSelectedLeave?: (data: LeaveNotificationType) => void;
  setSelectedPromotion?: (data: PromotionNotificationType) => void;
  setSelectedResignation?: (data: ResignationNotificationType) => void;
  setIsLeaveModalOpen?: (isOpen: boolean) => void;
  setIsPromotionModalOpen?: (isOpen: boolean) => void;
  setIsResignationModalOpen?: (isOpen: boolean) => void;
}

const NotificationDropdown = ({
  notifications,
  onClose,
  setSelectedLeave,
  setSelectedPromotion,
  setSelectedResignation,
  setIsLeaveModalOpen,
  setIsPromotionModalOpen,
  setIsResignationModalOpen,
}: NotificationDropdownProps) => {
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedReadItems = localStorage.getItem("readNotifications");
    if (savedReadItems) {
      setReadNotifications(JSON.parse(savedReadItems));
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = notifications.map((item) => item.id);
    const uniqueReadIds = Array.from(
      new Set([...readNotifications, ...allIds]),
    );
    setReadNotifications(uniqueReadIds);
    localStorage.setItem("readNotifications", JSON.stringify(uniqueReadIds));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!readNotifications.includes(item.id)) {
      const updatedRead = [...readNotifications, item.id];
      setReadNotifications(updatedRead);
      localStorage.setItem("readNotifications", JSON.stringify(updatedRead));
    }

    if (item.type === "leave" && setSelectedLeave && setIsLeaveModalOpen) {
      setSelectedLeave(item as LeaveNotificationType);
      setIsLeaveModalOpen(true);
    } else if (
      item.type === "promotion" &&
      setSelectedPromotion &&
      setIsPromotionModalOpen
    ) {
      setSelectedPromotion(item as PromotionNotificationType);
      setIsPromotionModalOpen(true);
    } else if (
      item.type === "resignation" &&
      setSelectedResignation &&
      setIsResignationModalOpen
    ) {
      setSelectedResignation(item as ResignationNotificationType);
      setIsResignationModalOpen(true);
    }

    onClose();
  };

  const getRequestTypeConfig = (type: string) => {
    switch (type) {
      case "leave":
        return {
          text: "Leave Request",
          icon: Calendar,
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-100",
          hoverBg: "hover:bg-yellow-50",
        };
      case "promotion":
        return {
          text: "Promotion Request",
          icon: Briefcase,
          bgColor: "bg-indigo-50",
          textColor: "text-blue-500",
          borderColor: "border-indigo-100",
          hoverBg: "hover:bg-indigo-50",
        };
      case "resignation":
        return {
          text: "Resignation Request",
          icon: LogOut,
          bgColor: "bg-rose-50",
          textColor: "text-rose-700",
          borderColor: "border-rose-100",
          hoverBg: "hover:bg-rose-50",
        };
      default:
        return {
          text: "Request",
          icon: Bell,
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          borderColor: "border-gray-100",
          hoverBg: "hover:bg-gray-50",
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const renderNotificationContent = (item: NotificationItem) => {
    const isRead = readNotifications.includes(item.id);
    const requestConfig = getRequestTypeConfig(item.type || "default");

    if (item.type === "leave") {
      const leave = item as LeaveNotificationType;

      return (
        <div
          key={item.id}
          className={`group p-3 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
            isRead ? "bg-white" : "bg-blue-100"
          }`}
          onClick={() => handleNotificationClick(item)}
        >
          {/* Unread indicator dot */}

          <div className="flex items-start gap-2">
            {/* Content - No icons */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${requestConfig.textColor}`}
                >
                  {requestConfig.text}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDate(leave.fromDate)}
                </span>
              </div>

              <p
                className={`text-sm ${isRead ? "text-gray-700" : "font-semibold text-gray-900"}`}
              >
                {leave.name}
              </p>

              <p
                className={`text-xs mt-1 ${isRead ? "text-gray-500" : "text-gray-700"}`}
              >
                {leave.leaveSubject}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </div>
      );
    } else if (item.type === "promotion") {
      const promotion = item as PromotionNotificationType;

      return (
        <div
          key={promotion.id}
          className={`group p-3 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
            isRead
              ? "bg-white hover:bg-gray-50"
              : "bg-blue-50/40 hover:bg-blue-50"
          }`}
          onClick={() => handleNotificationClick(promotion)}
        >
          <div className="flex items-start gap-2">
            {/* Content - No icons */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${requestConfig.textColor}`}
                >
                  {requestConfig.text}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDate(promotion.date)}
                </span>
              </div>

              <p
                className={`text-sm ${isRead ? "text-gray-700" : "font-semibold text-gray-900"}`}
              >
                {promotion.employee_name}
              </p>

              <p
                className={`text-xs mt-1 ${isRead ? "text-gray-500" : "text-gray-700"}`}
              >
                {promotion.current_designation} →{" "}
                {promotion.requested_designation}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </div>
      );
    } else {
      const resignation = item as ResignationNotificationType;

      return (
        <div
          key={resignation.id}
          className={`group p-3 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
            isRead
              ? "bg-white hover:bg-gray-50"
              : "bg-blue-50/40 hover:bg-blue-50"
          }`}
          onClick={() => handleNotificationClick(resignation)}
        >
          <div className="flex items-start gap-2">
            {/* Content - No icons */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${requestConfig.textColor}`}
                >
                  {requestConfig.text}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatDate(resignation.resignation_date)}
                </span>
              </div>

              <p
                className={`text-sm ${isRead ? "text-gray-700" : "font-semibold text-gray-900"}`}
              >
                {resignation.employee_name}
              </p>

              <p
                className={`text-xs mt-1 ${isRead ? "text-gray-500" : "text-gray-700"}`}
              >
                {resignation.designation}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* 1. Mobile Backdrop: Prevents clicking underlying elements by mistake */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 md:hidden"
        onClick={onClose}
      />

      {/* 2. Responsive Container: Fixed on mobile, Absolute on desktop */}
      <div
        ref={dropdownRef}
        className="fixed md:absolute top-0 md:top-full right-0 left-0 md:left-auto w-full md:w-[320px] z-50 p-4 md:p-0 md:mt-2"
      >
        <div className="bg-white w-full rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-top-2 duration-200 max-h-[70vh] md:max-h-[400px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <h3 className="font-semibold text-sm">Notifications</h3>
              </div>
              <button
                onClick={handleMarkAllRead}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg transition-all"
              >
                Mark all read
              </button>
            </div>
          </div>

          {/* Notifications List - Added overscroll-contain for better mobile UX */}
          <div className="overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="w-12 h-12 text-gray-200 mb-2" />
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((item) => renderNotificationContent(item))
            )}
          </div>

          {/* Footer - Mobile Close Button */}
          <div className="md:hidden border-t border-gray-100 p-2 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-2 text-sm font-semibold text-gray-500 active:bg-gray-100 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;

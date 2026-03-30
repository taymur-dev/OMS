import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Calendar,
  Briefcase,
  LogOut,
  ChevronRight,
  Circle,
  CheckCircle2,
} from "lucide-react";

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
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          borderColor: "border-purple-100",
          hoverBg: "hover:bg-purple-50",
        };
      case "promotion":
        return {
          text: "Promotion Request",
          icon: Briefcase,
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-700",
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

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "approved" || statusLower === "accepted") {
      return {
        text: status,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        icon: CheckCircle2,
      };
    } else if (statusLower === "pending") {
      return {
        text: status,
        bgColor: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
        icon: Circle,
      };
    } else {
      return {
        text: status,
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200",
        icon: Circle,
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
    const RequestIcon = requestConfig.icon;

    if (item.type === "leave") {
      const leave = item as LeaveNotificationType;
      const statusConfig = getStatusConfig(leave.leaveStatus);
      const StatusIcon = statusConfig.icon;

      return (
        <div
          key={leave.id}
          className={`group relative p-4 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
            isRead
              ? "bg-white hover:bg-gray-50"
              : "bg-gradient-to-r from-blue-50/50 to-white hover:from-blue-50 hover:to-blue-50/50"
          }`}
          onClick={() => handleNotificationClick(leave)}
        >
          {/* Unread indicator */}
          {!isRead && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600" />
          )}

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl ${requestConfig.bgColor} flex items-center justify-center transition-transform group-hover:scale-105`}
            >
              <RequestIcon className={`w-5 h-5 ${requestConfig.textColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${requestConfig.textColor}`}
                >
                  {requestConfig.text}
                </span>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span className="text-[10px] font-medium">
                    {statusConfig.text}
                  </span>
                </div>
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

              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-400">
                  {(() => {
                    const from = leave.fromDate.split("T")[0];
                    const to = leave.toDate.split("T")[0];
                    return from === to ? from : `${from} - ${to}`;
                  })()}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      );
    } else if (item.type === "promotion") {
      const promotion = item as PromotionNotificationType;
      const statusConfig = getStatusConfig(promotion.approval);
      const StatusIcon = statusConfig.icon;

      return (
        <div
          key={promotion.id}
          className={`group relative p-4 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
            isRead
              ? "bg-white hover:bg-gray-50"
              : "bg-gradient-to-r from-blue-50/50 to-white hover:from-blue-50 hover:to-blue-50/50"
          }`}
          onClick={() => handleNotificationClick(promotion)}
        >
          {!isRead && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600" />
          )}

          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl ${requestConfig.bgColor} flex items-center justify-center transition-transform group-hover:scale-105`}
            >
              <RequestIcon className={`w-5 h-5 ${requestConfig.textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${requestConfig.textColor}`}
                >
                  {requestConfig.text}
                </span>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span className="text-[10px] font-medium">
                    {statusConfig.text}
                  </span>
                </div>
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

              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-400">
                  {formatDate(promotion.date)}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      );
    } else {
      const resignation = item as ResignationNotificationType;
      const statusConfig = getStatusConfig(resignation.approval_status);
      const StatusIcon = statusConfig.icon;

      return (
        <div
          key={resignation.id}
          className={`group relative p-4 border-b border-gray-100 transition-all duration-200 cursor-pointer ${
            isRead
              ? "bg-white hover:bg-gray-50"
              : "bg-gradient-to-r from-blue-50/50 to-white hover:from-blue-50 hover:to-blue-50/50"
          }`}
          onClick={() => handleNotificationClick(resignation)}
        >
          {!isRead && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600" />
          )}

          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-xl ${requestConfig.bgColor} flex items-center justify-center transition-transform group-hover:scale-105`}
            >
              <RequestIcon className={`w-5 h-5 ${requestConfig.textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`text-xs font-semibold ${requestConfig.textColor}`}
                >
                  {requestConfig.text}
                </span>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span className="text-[10px] font-medium">
                    {statusConfig.text}
                  </span>
                </div>
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

              <div className="flex items-center gap-2 mt-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-[11px] text-gray-400">
                  {formatDate(resignation.resignation_date)}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      );
    }
  };

  const unreadCount = notifications.filter(
    (item) => !readNotifications.includes(item.id),
  ).length;

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
        className="fixed md:absolute top-0 md:top-full right-0 left-0 md:left-auto w-full md:w-[380px] z-50 p-4 md:p-0 md:mt-2"
      >
        <div className="bg-white w-full rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-top-2 duration-200 max-h-[85vh] md:max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Bell className="w-5 h-5" />
                <h3 className="font-semibold text-base">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={handleMarkAllRead}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-all"
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

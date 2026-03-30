// Header.tsx (updated with resignations and last 5 values)
import { RxHamburgerMenu } from "react-icons/rx";
import { RiUserFill } from "react-icons/ri";
import headerLogo from "../assets/Desk_Logo.png";
import { CiBellOn } from "react-icons/ci";
import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../redux/Hooks";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileComponent/ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { LeaveNotification } from "./LeaveNotification";
import { PromotionNotificationModal } from "./PromotionNotificationModal";
import { ResignationNotificationModal } from "./ResignationNotificationModal"; // Create this
import axios from "axios";
import { BASE_URL } from "../Content/URL";

// Define interfaces
interface ILeaveData {
  id: number;
  name: string;
  leaveStatus: string;
  leaveSubject: string;
  fromDate: string;
  toDate: string;
  type?: "leave";
}

interface IPromotionData {
  id: number;
  employee_name: string;
  current_designation: string;
  requested_designation: string;
  approval: string;
  note: string;
  date: string;
  type?: "promotion";
}

interface IResignationData {
  id: number;
  employee_name: string;
  designation: string;
  resignation_date: string;
  note: string;
  approval_status: string;
  type?: "resignation";
}

type NotificationItem = ILeaveData | IPromotionData | IResignationData;

export interface IHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
  toggleSideBar: () => void;
  isOpen: boolean;
}

export const Header = ({ toggleSideBar, isOpen }: IHeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<number[]>([]);

  const [selectedLeave, setSelectedLeave] = useState<ILeaveData | null>(null);
  const [selectedPromotion, setSelectedPromotion] =
    useState<IPromotionData | null>(null);
  const [selectedResignation, setSelectedResignation] =
    useState<IResignationData | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isResignationModalOpen, setIsResignationModalOpen] = useState(false);

  // Sync read status from localStorage
  const syncReadStatus = useCallback(() => {
    const savedReadItems = localStorage.getItem("readNotifications");
    if (savedReadItems) {
      setReadIds(JSON.parse(savedReadItems));
    }
  }, []);

  const handleLogoClick = () => {
    const role = currentUser?.role?.toLowerCase();
    if (role === "admin") navigate("/");
    else if (role === "user") navigate("/User/dashboard");
    else navigate("/");
  };

  // Fetch last 5 leaves
  const fetchLeaves = useCallback(async (): Promise<ILeaveData[]> => {
    if (!currentUser) return [];
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getUsersLeaves`
          : `${BASE_URL}/api/user/getMyLeaves`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      const allLeaves = Array.isArray(res.data) ? res.data : [];
      
      // Get last 5 leaves and add type
      const leavesWithType = allLeaves
        .slice(-5)
        .reverse()
        .map((leave: ILeaveData) => ({
          ...leave,
          type: "leave" as const,
        }));

      return leavesWithType;
    } catch (error) {
      console.error("Error fetching leaves", error);
      return [];
    }
  }, [currentUser]);

  // Fetch last 5 promotions
  const fetchPromotions = useCallback(async (): Promise<IPromotionData[]> => {
    if (!currentUser) return [];
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getPromotions`
          : `${BASE_URL}/api/user/getMyPromotions`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      const allPromotions = Array.isArray(res.data) ? res.data : [];
      
      // Get last 5 promotions and add type
      const promotionsWithType = allPromotions
        .slice(-5)
        .reverse()
        .map((promo: IPromotionData) => ({
          ...promo,
          type: "promotion" as const,
        }));

      return promotionsWithType;
    } catch (error) {
      console.error("Error fetching promotions", error);
      return [];
    }
  }, [currentUser]);

  // Fetch last 5 resignations
  const fetchResignations = useCallback(async (): Promise<
    IResignationData[]
  > => {
    if (!currentUser) return [];
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getResignations`
          : `${BASE_URL}/api/user/getMyResignations`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      const allResignations = Array.isArray(res.data) ? res.data : [];
      
      // Get last 5 resignations and add type
      const resignationsWithType = allResignations
        .slice(-5)
        .reverse()
        .map((resignation: IResignationData) => ({
          ...resignation,
          type: "resignation" as const,
        }));

      return resignationsWithType;
    } catch (error) {
      console.error("Error fetching resignations", error);
      return [];
    }
  }, [currentUser]);

  // Fetch all notifications (last 5 from each module)
  const fetchAllNotifications = useCallback(async () => {
    const [leaves, promotions, resignations] = await Promise.all([
      fetchLeaves(),
      fetchPromotions(),
      fetchResignations(),
    ]);

    // Combine all notifications
    const allNotifications = [...leaves, ...promotions, ...resignations];

    // Sort by date (most recent first)
    allNotifications.sort((a, b) => {
      let dateA: string, dateB: string;

      if (a.type === "leave") {
        dateA = (a as ILeaveData).fromDate;
      } else if (a.type === "promotion") {
        dateA = (a as IPromotionData).date;
      } else {
        dateA = (a as IResignationData).resignation_date;
      }

      if (b.type === "leave") {
        dateB = (b as ILeaveData).fromDate;
      } else if (b.type === "promotion") {
        dateB = (b as IPromotionData).date;
      } else {
        dateB = (b as IResignationData).resignation_date;
      }

      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    setNotifications(allNotifications);
  }, [fetchLeaves, fetchPromotions, fetchResignations]);

  useEffect(() => {
    if (currentUser) {
      fetchAllNotifications();
      syncReadStatus();
    }

    const handleFocus = () => {
      fetchAllNotifications();
      syncReadStatus();
    };

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [currentUser, fetchAllNotifications, syncReadStatus]);

  // Calculate unread count - exactly equal to number of unread notifications
  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.id),
  ).length;

  return (
    <div className="bg-white w-full h-16 px-2 sm:px-4 flex shadow-md z-40 items-center relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1 sm:gap-10">
          <div
            className="flex items-center w-[180px] flex-shrink-0 cursor-pointer"
            onClick={handleLogoClick}
          >
            <img
              src={headerLogo}
              alt="logo"
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </div>

          <button
            onClick={toggleSideBar}
            className="text-blue-400 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12"
            aria-label="Toggle sidebar"
          >
            <RxHamburgerMenu
              size={26}
              className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Notification Bell Container */}
            <div
              className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-red-600 flex items-center justify-center text-[10px] sm:text-[11px] text-white font-bold z-10 px-1.5">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              <CiBellOn size={28} className="relative text-gray-700" />

              {isNotifOpen && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => {
                    setIsNotifOpen(false);
                    syncReadStatus();
                  }}
                  setSelectedLeave={setSelectedLeave}
                  setSelectedPromotion={setSelectedPromotion}
                  setSelectedResignation={setSelectedResignation}
                  setIsLeaveModalOpen={setIsLeaveModalOpen}
                  setIsPromotionModalOpen={setIsPromotionModalOpen}
                  setIsResignationModalOpen={setIsResignationModalOpen}
                />
              )}
            </div>

            <div className="hidden xs:block text-right min-w-[70px] sm:min-w-[90px]">
              <p className="text-blue-500 text-xs sm:text-sm font-semibold leading-none truncate">
                {currentUser?.name || "User"}
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs capitalize truncate mt-0.5">
                {currentUser?.role || "Role"}
              </p>
            </div>

            <div
              onClick={() => setIsOpenModal(true)}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-400 flex items-center justify-center text-white overflow-hidden border-2 border-gray-100 shadow-sm cursor-pointer hover:border-blue-400 transition duration-200"
            >
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <RiUserFill size={28} />
              )}
            </div>
          </div>
        </div>

        {isOpenModal && (
          <div className="absolute top-9 right-4 z-50">
            <ProfileDropdown
              isOpenModal={true}
              setIsOpenModal={() => setIsOpenModal(false)}
            />
          </div>
        )}

        <LeaveNotification
          isOpen={isLeaveModalOpen}
          onClose={() => {
            setIsLeaveModalOpen(false);
            syncReadStatus();
          }}
          data={selectedLeave}
        />

        <PromotionNotificationModal
          isOpen={isPromotionModalOpen}
          onClose={() => {
            setIsPromotionModalOpen(false);
            syncReadStatus();
          }}
          data={selectedPromotion}
        />

        <ResignationNotificationModal
          isOpen={isResignationModalOpen}
          onClose={() => {
            setIsResignationModalOpen(false);
            syncReadStatus();
          }}
          data={selectedResignation}
        />
      </div>
    </div>
  );
};
import { Title } from "../Title";

type AttendanceT = {
  id: number;
  attendanceStatus: string;
  clockIn: string;
  clockOut: string;
  date: string;
  day: string;
  leaveApprovalStatus: string | null;
  leaveReason: string | null;
  name: string;
  role: string;
  status: string;
  userId: number;
  workingHours: string;
};

type ViewAttendanceProps = {
  setIsOpenModal: () => void;
  viewAttendance: AttendanceT | null;
};

export const ViewAttendance = ({
  setIsOpenModal,
  viewAttendance,
}: ViewAttendanceProps) => {
  if (!viewAttendance) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              USER ATTENDANCE DETAILS
            </Title>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                User Name:
              </span>
              <p className="text-gray-600">{viewAttendance.name}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Role:</span>
              <p className="text-gray-600">{viewAttendance.role}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">
                {viewAttendance.date.slice(0, 10)}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Day:</span>
              <p className="text-gray-600">{viewAttendance.day}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Clock In:
              </span>
              <p className="text-gray-600">{viewAttendance.clockIn ?? "--"}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Clock Out:
              </span>
              <p className="text-gray-600">{viewAttendance.clockOut ?? "--"}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Working Hours:
              </span>
              <p className="text-gray-600">
                {viewAttendance.workingHours ?? "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

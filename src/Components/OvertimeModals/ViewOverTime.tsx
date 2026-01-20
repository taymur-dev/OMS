import { Title } from "../Title";
import profilePicture from "../../assets/vector.png";

type OVERTIMET = {
  id: number;
  name: string;
  date: string;
  totalTime: string;
  approvalStatus: string;
};

type ViewOvertimeProps = {
  setModal: () => void;
  data: OVERTIMET;
};

export const ViewOverTimeModal = ({ setModal, data }: ViewOvertimeProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              OverTime Details
            </Title>
          </div>
          <div className="flex items-center pt-4 space-x-4">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full border border-indigo-200 shadow-sm"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
              <p className="text-sm text-gray-500">Employee</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">
                {new Date(data.date).toLocaleDateString("sv-SE")}
              </p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Over Time:
              </span>
              <p className="text-gray-600">{data.totalTime}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Approval Status:
              </span>
              <p className="text-gray-600 capitalize">{data.approvalStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Title } from "../Title";

type ViewLeaveProps = {
  setIsOpenModal: () => void;
  data: {
    id: number;
    leaveSubject: string;
    leaveReason: string;
    date: string;
    leaveStatus: string;
    status: string;
    name: string;
  } | null;
};

export const ViewLeave = ({ setIsOpenModal, data }: ViewLeaveProps) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Leave Details</Title>

          {/* Profile Section */}
          <div className="flex items-center gap-6 bg-white p-6 shadow-md rounded-lg">
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-800">{data.name}</h2>
              <h4 className="text-sm text-gray-500">Employee</h4>
            </div>
          </div>

          {/* User Details */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">{data.date}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Leave Subject:</span>
              <p className="text-gray-600">{data.leaveSubject}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Status:</span>
              <p className="text-red-500 font-semibold bg-red-200 p-1 rounded">{data.leaveStatus}</p>
            </div>
          </div>

          <div className="border-b my-4">
            <span className="text-lg font-semibold text-gray-800 block my-2">Reason:</span>
            <div className="bg-gray-100 p-3 rounded-md max-h-36 overflow-y-auto">
              <p className="text-gray-600 whitespace-pre-line">{data.leaveReason}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

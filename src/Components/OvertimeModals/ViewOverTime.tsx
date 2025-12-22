import { Title } from "../Title";

import profilePicture from "../../assets/vector.png";

export type ViewUserT = {
  id: number;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  address: string;
  date: string;
  password: string;
  confirmPassword: string;
  role: string;
  image: string;
};
type ModalTProps = {
  setModal: () => void;
};
export const ViewOverTimeModal = ({ setModal }: ModalTProps) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          {/* Title */}
          <Title setModal={setModal}>Over Time Details</Title>

          {/* Profile Section */}

          {/* Profile Picture */}
          <div className="flex items-center pt-4 space-x-4">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full border border-indigo-200 shadow-sm"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Guest</h2>
              <p className="text-sm text-gray-500">User</p>
            </div>
          </div>

          {/* User Details List */}
          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">{"11/6/2025"}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Over Time
              </span>
              <p className="text-gray-600">{"2:10:33"}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Detail
              </span>
              <p className="text-gray-600">
                {"i will work no this project i do more time this project"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Title } from "./Title";
import profilePicture from "../assets/vector.png";
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
  // image: string;
};
type ModalTProps = {
  setModal: () => void;
  viewUserDetail: ViewUserT;
};
export const ViewUserDetailModal = ({
  setModal,
  viewUserDetail,
}: ModalTProps) => {
  console.log(viewUserDetail, "date");
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <div className="bg-blue-600 rounded-t-xl px-4">
                      <div className="text-white">
                        <Title setModal={setModal}>VIEW USER</Title>
                      </div>
                    </div>
          <div className="flex items-center gap-6 bg-white p-6 shadow-md rounded-lg">
            <img
              className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
              src={profilePicture}
              alt="Profile"
            />

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-800">
                {viewUserDetail.name}
              </h2>
              <h4 className="text-sm text-gray-500">{viewUserDetail.role}</h4>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Email:
              </span>
              <p className="text-gray-600">{viewUserDetail.email}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">CNIC:</span>
              <p className="text-gray-600">{viewUserDetail.cnic}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">
                {viewUserDetail.date.slice(0, 10)}
              </p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Address:
              </span>
              <p className="text-gray-600">{viewUserDetail.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

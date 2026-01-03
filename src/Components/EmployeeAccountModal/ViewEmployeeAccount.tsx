import { Title } from "../Title";

type EmployeeAccountRow = {
  id: number;
  name: string;
  email: string;
  contact: string;
};

type ModalTProps = {
  setModal: () => void;
  employee: EmployeeAccountRow;
};

export const ViewEmployeeAccount = ({
  setModal,
  employee,
}: ModalTProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setModal}>Employee Account Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Name:
              </span>
              <p className="text-gray-600">{employee.name}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Email:
              </span>
              <p className="text-gray-600">{employee.email}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Contact:
              </span>
              <p className="text-gray-600">{employee.contact}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

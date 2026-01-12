import { Title } from "../Title";

export type AdvanceSalaryType = {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: number;
  approvalStatus: string;
  description: string;
};

type ViewAdvanceSalaryProps = {
  setIsOpenModal: () => void;
  viewAdvance: AdvanceSalaryType | null;
};

export const ViewAdvanceSalary = ({
  setIsOpenModal,
  viewAdvance,
}: ViewAdvanceSalaryProps) => {
  if (!viewAdvance) return null; 

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Advance Salary Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Employee:</span>
              <p className="text-gray-600">{viewAdvance.employee_name}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">{viewAdvance.date.slice(0, 10)}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Amount:</span>
              <p className="text-gray-600">{viewAdvance.amount}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Approval Status:</span>
              <p className="text-gray-600">{viewAdvance.approvalStatus}</p>
            </div>

            {viewAdvance.description && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">Description:</span>
                <p className="text-gray-600">{viewAdvance.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


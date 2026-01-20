import { Title } from "../Title";

export type ConfigEmpSalaryT = {
  employeeName: string;
  employeeSalary: string;
  empMonthAllowance?: string;
  transportAllowance?: string;
  medicalAllowance?: string;
  totalSalary?: string;
  date?: string;
};

type ViewConfigEmpSalaryProps = {
  setModal: () => void;
  viewSalary: ConfigEmpSalaryT | null;
};

export const ViewConfigEmpSalary = ({
  setModal,
  viewSalary,
}: ViewConfigEmpSalaryProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Employee Salary Details
            </Title>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Name:
              </span>
              <p className="text-gray-600">{viewSalary?.employeeName}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Salary:
              </span>
              <p className="text-gray-600">{viewSalary?.employeeSalary}</p>
            </div>

            {viewSalary?.empMonthAllowance && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  House Rent:
                </span>
                <p className="text-gray-600">{viewSalary.empMonthAllowance}</p>
              </div>
            )}

            {viewSalary?.transportAllowance && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Transport Allowance:
                </span>
                <p className="text-gray-600">{viewSalary.transportAllowance}</p>
              </div>
            )}

            {viewSalary?.medicalAllowance && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Medical Allowance:
                </span>
                <p className="text-gray-600">{viewSalary.medicalAllowance}</p>
              </div>
            )}

            {viewSalary?.totalSalary && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Total Salary:
                </span>
                <p className="text-gray-600">{viewSalary.totalSalary}</p>
              </div>
            )}

            {viewSalary?.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">{viewSalary.date.slice(0, 10)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

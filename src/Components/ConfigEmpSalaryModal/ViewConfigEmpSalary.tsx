import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Title } from "../Title";
import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";

type ModalTProps = {
  setModal: () => void;
  salaryId?: number;
};

const initialState = {
  employeeName: "",
  employeeSalary: "",
  empMonthAllowance: "",
  transportAllowance: "",
  medicalAllowance: "",
  totalSalary: "",
  date: "",
};

export const ViewConfigEmpSalary = ({ setModal, salaryId }: ModalTProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [salaryData, setSalaryData] = useState(initialState);

  const getSalaryData = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getSalary/${salaryId}`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      const data = res.data;
      setSalaryData({
        employeeName: data.employeeName || "",
        employeeSalary: data.employeeSalary?.toString() || "",
        empMonthAllowance: data.empMonthAllowance?.toString() || "",
        transportAllowance: data.transportAllowance?.toString() || "",
        medicalAllowance: data.medicalAllowance?.toString() || "",
        totalSalary: data.totalSalary?.toString() || "",
        date: data.date || "",
      });
    } catch (error) {
      console.error("Failed to fetch salary data:", error);
    }
  }, [salaryId, token]);

  useEffect(() => {
    getSalaryData();
  }, [getSalaryData]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setModal}>Employee Salary Details</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Name:
              </span>
              <p className="text-gray-600">{salaryData.employeeName}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Salary:
              </span>
              <p className="text-gray-600">{salaryData.employeeSalary}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Employee Month Allowance:
              </span>
              <p className="text-gray-600">{salaryData.empMonthAllowance}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Transport Allowance:
              </span>
              <p className="text-gray-600">{salaryData.transportAllowance}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Medical Allowance:
              </span>
              <p className="text-gray-600">{salaryData.medicalAllowance}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Total Salary:
              </span>
              <p className="text-gray-600">{salaryData.totalSalary}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">{salaryData.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

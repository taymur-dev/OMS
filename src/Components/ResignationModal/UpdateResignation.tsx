import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";

type UpdatedResignationT = {
  id: number;
  employee_name: string;
  designation: string;
  note: string;
  resignation_date: string;
  approval_status: string;
};

type UpdateResignationProps = {
  setModal: () => void;
  resignationData: {
    id: string;
    employee_name: string;
    designation: string;
    note: string;
    date: string;
    approval_status: string;
  };
  handleRefresh?: (updatedItem: UpdatedResignationT) => void;
};

export const UpdateResignation = ({
  setModal,
  resignationData,
  handleRefresh,
}: UpdateResignationProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateResignation, setUpdateResignation] = useState({
    id: "",
    employee_name: "",
    designation: "",
    note: "",
    resignation_date: "",
    approval_status: "PENDING",
  });

  useEffect(() => {
    if (!resignationData) return;

    const formattedDate = resignationData.date
      ? resignationData.date.includes("T")
        ? resignationData.date.split("T")[0]
        : resignationData.date
      : "";

    setUpdateResignation({
      id: resignationData.id,
      employee_name: resignationData.employee_name || "",
      designation: resignationData.designation || "",
      note: resignationData.note || "",
      resignation_date: formattedDate,
      approval_status:
        resignationData.approval_status?.toUpperCase() || "PENDING",
    });
  }, [resignationData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateResignation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { id, designation, note, resignation_date, approval_status } =
      updateResignation;

    if (!designation || !note || !resignation_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/updateResignation/${id}`,
        {
          designation,
          note,
          resignation_date,
          approval_status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Resignation updated successfully");

      handleRefresh?.({
        id: Number(id),
        employee_name: updateResignation.employee_name,
        designation,
        note,
        resignation_date,
        approval_status,
      });

      setModal();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to update resignation"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4  flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Edit Employee Resignation
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 py-2 gap-2 space-y-2">
            <InputField
              labelName="Employee Name"
              name="employee_name"
              type="text"
              value={updateResignation.employee_name}
              handlerChange={handleChange}
              disabled
            />

            <InputField
              labelName="Current Designation"
              name="designation"
              type="text"
              value={updateResignation.designation}
              handlerChange={handleChange}
              disabled
            />

            <InputField
              labelName="Date*"
              name="resignation_date"
              type="date"
              value={updateResignation.resignation_date}
              handlerChange={handleChange}
            />

            <TextareaField
              labelName="Note*"
              name="note"
              inputVal={updateResignation.note}
              handlerChange={handleChange}
              placeHolder="Write resignation note"
            />

            <select
              name="approval_status"
              value={updateResignation.approval_status}
              onChange={handleChange}
              className="border border-gray-400 rounded p-1 w-full"
            >
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};

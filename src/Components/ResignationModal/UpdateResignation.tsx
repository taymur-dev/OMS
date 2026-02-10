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
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "note") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }
    setUpdateResignation((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { id, designation, note, resignation_date, approval_status } =
      updateResignation;

    if (!designation || !note || !resignation_date) {
      return toast.error("Please fill all required fields", {
        toastId: "update-resignation-validation",
      });
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Resignation updated successfully", {
        toastId: "update-resignation-success",
      });

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
        axiosError.response?.data?.message || "Failed to update resignation",
        { toastId: "update-resignation-error" },
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur px-4  flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] bg-white rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT EMPLOYEE RESIGNATION
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-2 space-y-2">
            <InputField
              labelName="Employee Name *"
              name="employee_name"
              type="text"
              value={updateResignation.employee_name}
              handlerChange={handleChange}
              disabled
            />

            <InputField
              labelName="Current Designation *"
              name="designation"
              type="text"
              value={updateResignation.designation}
              handlerChange={handleChange}
              disabled
            />

            <InputField
              labelName="Date *"
              name="resignation_date"
              type="date"
              value={updateResignation.resignation_date}
              handlerChange={handleChange}
            />

            <TextareaField
              labelName="Note *"
              name="note"
              inputVal={updateResignation.note}
              handlerChange={handleChange}
            />

            <div className="flex flex-col md:col-span-2 gap-1">
              <label className="text-sm font-medium text-gray-700">
                Approval Status*
              </label>
              <select
                name="approval_status"
                value={updateResignation.approval_status}
                onChange={handleChange}
                className="border border-black rounded-lg py-2 w-full focus:outline-indigo-600"
              >
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};

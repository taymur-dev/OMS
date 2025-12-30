import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

type UpdateLEAVET = {
  id: number;
  name: string;
  leaveSubject: string;
  leaveStatus: string;
  status: string;
  leaveReason: string;
  date: string;
};

type UpdateLeaveProps = {
  setModal: () => void;
  EditLeave: UpdateLEAVET | null;
  refreshLeaves: () => Promise<void>;
};

const optionData = [
  { id: 1, label: "Approved", value: "approved" },
  { id: 2, label: "Rejected", value: "rejected" },
  { id: 3, label: "Pending", value: "pending" },
];

const currentDate =
  new Date(new Date().toISOString()).toLocaleDateString("sv-SE") ?? "";

const initialState = {
  leaveSubject: "",
  date: currentDate,
  leaveReason: "",
  status: "pending",
};

export const UpdateLeave = ({
  setModal,
  EditLeave,
  refreshLeaves,
}: UpdateLeaveProps) => {
  const [updateLeave, setUpdateLeave] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (EditLeave) {
      setUpdateLeave({
        leaveSubject: EditLeave.leaveSubject || "",
        date: EditLeave.date || currentDate,
        leaveReason: EditLeave.leaveReason || "",
        status: EditLeave.leaveStatus?.toLowerCase() || "pending",
      });
    }
  }, [EditLeave]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EditLeave) return;

    setSubmitting(true);

    try {
      const payload = {
        date: new Date(updateLeave.date).toISOString().split("T")[0],
        leaveStatus: updateLeave.status,
        leaveSubject: updateLeave.leaveSubject,
        leaveReason: updateLeave.leaveReason,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updateLeave/${EditLeave.id}`,
        payload
      );

      await refreshLeaves();

      setModal();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500 p-4 overflow-auto">
        <form onSubmit={handleSubmit}>
          <Title setModal={setModal}>Update Leave</Title>

          <div className="flex flex-col gap-3">
            <InputField
              labelName="Subject Leave*"
              placeHolder="Enter the Leave Subject"
              type="text"
              name="leaveSubject"
              value={updateLeave.leaveSubject}
              handlerChange={handleChange}
            />

            <InputField
              labelName="Date*"
              type="date"
              name="date"
              value={updateLeave.date}
              handlerChange={handleChange}
            />

            <TextareaField
              labelName="Leave Reason*"
              placeHolder="Enter the Leave Reason"
              name="leaveReason"
              inputVal={updateLeave.leaveReason}
              handlerChange={handleChange}
            />

            <OptionField
              labelName="Status"
              name="status"
              value={updateLeave.status}
              handlerChange={handleChange}
              optionData={optionData}
              inital="Pending"
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label={submitting ? "Updating..." : "Update Leave"} />
          </div>
        </form>
      </div>
    </div>
  );
};

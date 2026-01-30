import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { OptionField } from "../InputFields/OptionField";
import { useAppSelector } from "../../redux/Hooks";

import { Title } from "../Title";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Content/URL";

type UpdateLEAVET = {
  id: number;
  name: string;
  leaveSubject: string;
  leaveStatus: string;
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

const currentDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Karachi",
});

export const UpdateLeave = ({
  setModal,
  EditLeave,
  refreshLeaves,
}: UpdateLeaveProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState); // ✅ inside component

  const [updateLeave, setUpdateLeave] = useState({
    leaveSubject: "",
    date: currentDate,
    leaveReason: "",
    status: "pending",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (EditLeave) {
      const dateOnly = EditLeave.date
        ? new Date(EditLeave.date).toLocaleDateString("sv-SE", {
            timeZone: "Asia/Karachi",
          })
        : currentDate;

      setUpdateLeave({
        leaveSubject: EditLeave.leaveSubject || "",
        date: dateOnly,
        leaveReason: EditLeave.leaveReason || "",
        status: EditLeave.leaveStatus?.toLowerCase() || "pending",
      });
    }
  }, [EditLeave]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
        date: updateLeave.date,
        leaveStatus: updateLeave.status,
        leaveSubject: updateLeave.leaveSubject,
        leaveReason: updateLeave.leaveReason,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updateLeave/${EditLeave.id}`,
        payload,
      );
      toast.success("Leave updated successfully!");
      await refreshLeaves();
      setModal();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update leave.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center px-4 justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded border border-indigo-900 overflow-auto shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-xl font-semibold"
            >
              EDIT LEAVE
            </Title>
          </div>

          {/* Form Body */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 px-6 py-2">
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

            {/* Only show status dropdown for admins */}
            {currentUser?.role === "admin" && (
              <OptionField
                labelName="Status"
                name="status"
                value={updateLeave.status}
                handlerChange={handleChange}
                optionData={optionData}
                inital="Pending"
              />
            )}

            <TextareaField
              labelName="Leave Reason*"
              placeHolder="Enter the Leave Reason"
              name="leaveReason"
              inputVal={updateLeave.leaveReason}
              handlerChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-2 bg-indigo-900 rounded border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              label={submitting ? "Updating..." : "Update"}
              loading={submitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

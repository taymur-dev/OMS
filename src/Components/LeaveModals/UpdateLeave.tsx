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
  fromDate: string;
  toDate: string;
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
    fromDate: "",
    toDate: "",
    leaveReason: "",
    status: "pending",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (EditLeave) {
      const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("sv-SE", {
          timeZone: "Asia/Karachi",
        });
      };

      setUpdateLeave({
        leaveSubject: EditLeave.leaveSubject || "",
        fromDate: EditLeave.fromDate
          ? formatDate(EditLeave.fromDate)
          : currentDate,
        toDate: EditLeave.toDate ? formatDate(EditLeave.toDate) : currentDate,
        leaveReason: EditLeave.leaveReason || "",
        status: EditLeave.leaveStatus?.toLowerCase() || "pending",
      });
    }
  }, [EditLeave]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    value = value.replace(/^\s+/, "");

    if (name === "leaveSubject") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value.slice(0, 50);
    }

    if (name === "leaveReason") {
      value = value.slice(0, 250);
    }

    setUpdateLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EditLeave) return;

    const { leaveSubject, fromDate, toDate, leaveReason } = updateLeave;

    if (!leaveSubject || !fromDate || !toDate || !leaveReason) {
      toast.error("Please fill all required fields", {
        toastId: "update-leave-required",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fromDate: updateLeave.fromDate,
        toDate: updateLeave.toDate,
        leaveStatus: updateLeave.status,
        leaveSubject: updateLeave.leaveSubject,
        leaveReason: updateLeave.leaveReason,
      };

      await axios.put(
        `${BASE_URL}/api/admin/updateLeave/${EditLeave.id}`,
        payload,
      );
      toast.success("Leave updated successfully!", {
        toastId: "update-leave-success",
      });

      await refreshLeaves();
      setModal();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update leave.", { toastId: "update-leave-error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center px-4 justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white rounded border border-indigo-900 overflow-auto shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
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
              type="text"
              name="leaveSubject"
              value={updateLeave.leaveSubject}
              handlerChange={handleChange}
            />

            <InputField
              labelName="From Date*"
              type="date"
              name="fromDate"
              value={updateLeave.fromDate}
              handlerChange={handleChange}
            />

            <InputField
              labelName="To Date*"
              type="date"
              name="toDate"
              value={updateLeave.toDate}
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
              name="leaveReason"
              inputVal={updateLeave.leaveReason}
              handlerChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-2 bg-indigo-900 rounded border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={submitting}
              label={submitting ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

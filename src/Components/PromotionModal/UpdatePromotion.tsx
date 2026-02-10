import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

const currentDate = new Date().toLocaleDateString("sv-SE");

type PromotionType = {
  id: number;
  current_designation: string;
  requested_designation: string;
  note: string;
  date: string;
  approval?: string;
};

type UpdatePromotionProps = {
  setModal: () => void;
  promotionData: PromotionType;
  handleRefresh: () => void;
};

type PromotionFormType = {
  current_designation: string;
  requested_designation: string;
  note: string;
  date: string;
  approvalStatus: string;
};

const ApprovalOptions: { id: number; value: string; label: string }[] = [
  { id: 1, label: "Accepted", value: "ACCEPTED" },
  { id: 2, label: "Rejected", value: "REJECTED" },
];

export const UpdatePromotion = ({
  setModal,
  promotionData,
  handleRefresh,
}: UpdatePromotionProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [promotion, setPromotion] = useState<PromotionFormType>({
    current_designation: "",
    requested_designation: "",
    note: "",
    date: currentDate,
    approvalStatus: "PENDING",
  });

  useEffect(() => {
    if (!promotionData) return;

    setPromotion({
      current_designation: promotionData.current_designation,
      requested_designation: promotionData.requested_designation,
      note: promotionData.note,
      date: promotionData.date?.slice(0, 10) || currentDate,
      approvalStatus: promotionData.approval || "PENDING",
    });
  }, [promotionData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setPromotion((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      current_designation,
      requested_designation,
      note,
      date,
      approvalStatus,
    } = promotion;

    if (!current_designation || !requested_designation || !note || !date) {
      return toast.error("Please fill all required fields", {
        toastId: "update-promotion-validation",
      });
    }

    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/updatePromotion/${promotionData.id}`
        : `${BASE_URL}/api/user/updatePromotion/${promotionData.id}`;

      await axios.put(
        url,
        {
          current_designation,
          requested_designation,
          note,
          date,
          approvalStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Promotion updated successfully", {
        toastId: "update-promotion-success",
      });

      handleRefresh();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to update promotion",
        { toastId: "update-promotion-error" },
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
              EDIT PROMOTION REQUEST
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <InputField
              labelName="Current Designation *"
              name="current_designation"
              value={promotion.current_designation}
              handlerChange={handleChange}
              type="text"
            />

            <InputField
              labelName="Requested Designation *"
              name="requested_designation"
              value={promotion.requested_designation}
              handlerChange={handleChange}
              type="text"
            />

            <InputField
              labelName="Date *"
              name="date"
              type="date"
              value={promotion.date}
              handlerChange={handleChange}
            />

            <TextareaField
              labelName="Note *"
              name="note"
              inputVal={promotion.note}
              handlerChange={handleChange}
            />

            <div className="md:col-span-2">
              {isAdmin && (
                <OptionField
                  labelName="Approval Status"
                  name="approvalStatus"
                  value={promotion.approvalStatus}
                  handlerChange={handleChange}
                  optionData={ApprovalOptions}
                  inital="Select Status"
                />
              )}
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

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

const currentDate = new Date().toISOString().slice(0, 10);

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

const ApprovalOptions = [
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
    >
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
      toast.error("Please fill all required fields");
      return;
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Promotion updated successfully");
      handleRefresh();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to update promotion"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-500">
        <form onSubmit={handleSubmit}>
          <Title setModal={setModal}>Update Employee Promotion</Title>

          <div className="mx-2 flex-wrap gap-3">
            <InputField
              labelName="Current Designation*"
              name="current_designation"
              value={promotion.current_designation}
              handlerChange={handleChange}
              type="text"
              placeHolder="Enter current designation"
            />

            <InputField
              labelName="Requested Designation*"
              name="requested_designation"
              value={promotion.requested_designation}
              handlerChange={handleChange}
              type="text"
              placeHolder="Enter requested designation"
            />

            <TextareaField
              labelName="Note*"
              name="note"
              inputVal={promotion.note}
              handlerChange={handleChange}
              placeHolder="Write promotion details"
            />

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              value={promotion.date}
              handlerChange={handleChange}
            />

            {isAdmin && (
              <OptionField
                labelName="Approval Status"
                name="approvalStatus"
                value={promotion.approvalStatus}
                handlerChange={handleChange}
                optionData={ApprovalOptions}
                inital="Pending"
              />
            )}
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Promotion" />
          </div>
        </form>
      </div>
    </div>
  );
};

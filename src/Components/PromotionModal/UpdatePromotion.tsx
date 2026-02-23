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
  approval: string;
};

const ApprovalOptions: { id: number; value: string; label: string }[] = [
  { id: 1, label: "Pending", value: "PENDING" },
  { id: 2, label: "Accepted", value: "ACCEPTED" },
  { id: 3, label: "Rejected", value: "REJECTED" },
];

export const UpdatePromotion = ({
  setModal,
  promotionData,
  handleRefresh,
}: UpdatePromotionProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [promotion, setPromotion] = useState<PromotionFormType>({
    current_designation: "",
    requested_designation: "",
    note: "",
    date: currentDate,
    approval: "PENDING",
  });

  useEffect(() => {
    if (promotionData) {
      setPromotion({
        current_designation: promotionData.current_designation || "",
        requested_designation: promotionData.requested_designation || "",
        note: promotionData.note || "",
        date: promotionData.date
          ? new Date(promotionData.date).toLocaleDateString("sv-SE")
          : currentDate,
        approval: promotionData.approval
          ? promotionData.approval.toUpperCase()
          : "PENDING",
      });
    }
  }, [promotionData]);

  const isAccepted = promotion.approval === "ACCEPTED";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "note") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    if (name === "requested_designation") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setPromotion((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { current_designation, requested_designation, note, date, approval } =
      promotion;

    if (
      !current_designation ||
      !requested_designation ||
      !note ||
      !date ||
      !approval
    ) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/updatePromotion/${promotionData.id}`
        : `${BASE_URL}/api/user/updatePromotion/${promotionData.id}`;

      await axios.put(
        url,
        { ...promotion },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Promotion updated successfully");
      handleRefresh();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to update promotion",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4 flex items-center justify-center z-50">
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

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 py-2 gap-3 mt-2">
            <InputField
              labelName="Current Position *"
              name="current_designation"
              value={promotion.current_designation}
              handlerChange={handleChange}
              type="text"
              disabled={isAdmin}
            />

            <InputField
              labelName="Requested Position *"
              name="requested_designation"
              value={promotion.requested_designation}
              handlerChange={handleChange}
              type="text"
              disabled={isAdmin}
            />

            <div className="md:col-span-2">
              <InputField
                labelName="Date *"
                name="date"
                type="date"
                value={promotion.date}
                handlerChange={handleChange}
                disabled={isAdmin}
              />
            </div>

            <div className="md:col-span-2">
              {isAdmin && (
                <OptionField
                  labelName="Approval Status *"
                  name="approval"
                  value={promotion.approval}
                  handlerChange={handleChange}
                  disabled={isAccepted}
                  optionData={ApprovalOptions}
                  inital="Select Status"
                />
              )}
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Note *"
                name="note"
                inputVal={promotion.note}
                handlerChange={handleChange}
                readOnly={isAdmin}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

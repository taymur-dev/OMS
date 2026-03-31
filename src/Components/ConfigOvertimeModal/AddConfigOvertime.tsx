import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

// UI Components
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { OptionField } from "../InputFields/OptionField";

type allOvertimeT = {
  id: number;
  overtimeType: string;
  amount: number | string;
};

type AddOvertimeProps = {
  setModal: () => void;
  refreshOvertime: () => void;
  existingOvertime: allOvertimeT[];
};

const initialState = {
  overtimeType: "",
  amount: "",
};

const hourOptions = [
  { id: 1, label: "1 Hour", value: "1 Hour" },
  { id: 2, label: "2 Hour", value: "2 Hour" },
  { id: 3, label: "3 Hour", value: "3 Hour" },
  { id: 4, label: "4 Hour", value: "4 Hour" },
  { id: 5, label: "5 Hour", value: "5 Hour" },
  { id: 6, label: "6 Hour", value: "6 Hour" },
  { id: 7, label: "7 Hour", value: "7 Hour" },
  { id: 8, label: "8 Hour", value: "8 Hour" },
  { id: 9, label: "9 Hour", value: "9 Hour" },
  { id: 10, label: "10 Hour", value: "10 Hour" },
  { id: 11, label: "11 Hour", value: "11 Hour" },
  { id: 12, label: "12 Hour", value: "12 Hour" },
];

export const AddConfigOvertime = ({
  setModal,
  refreshOvertime,
  existingOvertime,
}: AddOvertimeProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formState, setFormState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Remove logic that was hardcoding (hours * 1000)
    // Now we just update the specific field that changed
    setFormState((prev) => ({
      ...prev,
      [name]: name === "amount" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.overtimeType || !formState.amount) {
      return toast.error("Please fill in all fields");
    }

    const isDuplicate = existingOvertime.some(
      (item) => item.overtimeType === formState.overtimeType,
    );

    if (isDuplicate) {
      return toast.error("This overtime type already exists.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createOvertimeConfig`,
        formState,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Overtime config added successfully");
      refreshOvertime();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to add configuration",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[30rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD OVERTIME CONFIG
            </Title>
          </div>

          <div className="mx-4 flex flex-col py-6 gap-4">
            <OptionField
              labelName="Overtime Hours *"
              name="overtimeType"
              value={formState.overtimeType}
              handlerChange={handlerChange}
              optionData={hourOptions}
              inital="Select Hours"
            />

            <InputField
              labelName="Amount / Rate *"
              type="text"
              name="amount"
              value={formState.amount}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-6 bg-gray-50">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Saving..." : "Save Config"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { OptionField } from "../InputFields/OptionField";
import { InputField } from "../InputFields/InputField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type ALLCONFIGT = {
  id: number;
  startTime: string;
  endTime: string;
  offDay: string;
  lateTime: string;
  halfLeave: string;
  year: string;
  month: string;
};

type EditAttendanceProps = {
  setModal: () => void;
  handleGetAllTimeConfig: () => void;
  selectData: ALLCONFIGT | null;
};

const dayOptions = [
  { id: 1, label: "Monday", value: "Monday" },
  { id: 2, label: "Tuesday", value: "Tuesday" },
  { id: 3, label: "Wednesday", value: "Wednesday" },
  { id: 4, label: "Thursday", value: "Thursday" },
  { id: 5, label: "Friday", value: "Friday" },
  { id: 6, label: "Saturday", value: "Saturday" },
  { id: 7, label: "Sunday", value: "Sunday" },
];

const monthOptions = [
  { id: 1, label: "January", value: "January" },
  { id: 2, label: "February", value: "February" },
  { id: 3, label: "March", value: "March" },
  { id: 4, label: "April", value: "April" },
  { id: 5, label: "May", value: "May" },
  { id: 6, label: "June", value: "June" },
  { id: 7, label: "July", value: "July" },
  { id: 8, label: "August", value: "August" },
  { id: 9, label: "September", value: "September" },
  { id: 10, label: "October", value: "October" },
  { id: 11, label: "November", value: "November" },
  { id: 12, label: "December", value: "December" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: (currentYear + i).toString(),
  value: (currentYear + i).toString(),
}));

export const EditAttendanceRule = ({
  setModal,
  handleGetAllTimeConfig,
  selectData,
}: EditAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [updateConfig, setUpdateConfig] = useState<ALLCONFIGT | null>(
    selectData,
  );
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    if (updateConfig) {
      setUpdateConfig({ ...updateConfig, [name]: value });
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updateConfig) return;

    const { startTime, endTime, lateTime, halfLeave } = updateConfig;

    if (
      lateTime < startTime ||
      (lateTime > endTime && halfLeave < startTime) ||
      halfLeave > endTime
    ) {
      toast.error(
        "Late and Half Leave Time must be between Start Time and End Time",
      );
      return;
    }

    if (lateTime < startTime || lateTime > endTime) {
      toast.error("Late Time must be between Start Time and End Time");
      return;
    }

    if (halfLeave < startTime || halfLeave > endTime) {
      toast.error("Half Leave Time must be between Start Time and End Time");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start Time must be before End Time");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateTime/${updateConfig.id}`,
        updateConfig,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      handleGetAllTimeConfig();
      setModal();
      toast.success("Configuration updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[35rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-white rounded-xl border-t-5 border-blue-400">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                EDIT ATTENDANCE RULE
              </Title>
            </div>

            <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 py-6 gap-4">
              <InputField
                labelName="Start Time *"
                type="time"
                name="startTime"
                value={updateConfig?.startTime ?? ""}
                handlerChange={handlerChange}
              />
              <InputField
                labelName="End Time *"
                type="time"
                name="endTime"
                value={updateConfig?.endTime ?? ""}
                handlerChange={handlerChange}
              />

              <OptionField
                labelName="Off Day *"
                name="offDay"
                value={updateConfig?.offDay ?? ""}
                handlerChange={handlerChange}
                optionData={dayOptions}
                inital="Select Off Day"
              />

              <InputField
                labelName="Late Time *"
                type="time"
                name="lateTime"
                value={updateConfig?.lateTime ?? ""}
                handlerChange={handlerChange}
              />

              <div className="md:col-span-2">
                <InputField
                  labelName="Half Leave *"
                  type="time"
                  name="halfLeave"
                  value={updateConfig?.halfLeave ?? ""}
                  handlerChange={handlerChange}
                />
              </div>

              <OptionField
                labelName="Year *"
                name="year"
                value={updateConfig?.year ?? ""}
                handlerChange={handlerChange}
                optionData={yearOptions}
                inital="Select Year"
              />

              <OptionField
                labelName="Month *"
                name="month"
                value={updateConfig?.month ?? ""}
                handlerChange={handlerChange}
                optionData={monthOptions}
                inital="Select Month"
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-6 bg-white">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Updating" : "Update"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

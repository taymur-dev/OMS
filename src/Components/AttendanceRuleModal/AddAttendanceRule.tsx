import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllTimeConfig: () => void;
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

const initialState = {
  startTime: "",
  endTime: "",
  offDay: "",
  lateTime: "",
  halfLeave: "",
};

export const AddAttendanceRule = ({
  setModal,
  handleGetAllTimeConfig,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [addConfig, setAddConfig] = useState(initialState);
    const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAddConfig({ ...addConfig, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { startTime, endTime, lateTime, halfLeave } = addConfig;

     if (lateTime < startTime || lateTime > endTime && halfLeave < startTime || halfLeave > endTime) {
      toast.error("Late and Half Leave Time must be between Start Time and End Time");
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
      await axios.post(`${BASE_URL}/api/admin/configureTime`, addConfig, {
        headers: { Authorization: token },
      });
      handleGetAllTimeConfig();
      setModal();
      toast.success("Configuration saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error saving configuration");
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
        <div className="w-[42rem] max-h-[35rem] bg-white mx-auto rounded border border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD ATTENDANCE RULE
              </Title>
            </div>

            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 py-4 gap-4 px-4">
              <InputField
                labelName="Start Time *"
                type="time"
                name="startTime"
                value={addConfig.startTime}
                handlerChange={handlerChange}
              />
              <InputField
                labelName="End Time *"
                type="time"
                name="endTime"
                value={addConfig.endTime}
                handlerChange={handlerChange}
              />

              <OptionField
                labelName="Off Day *"
                name="offDay"
                value={addConfig.offDay}
                handlerChange={handlerChange}
                optionData={dayOptions}
                inital="Select Off Day"
              />

              <InputField
                labelName="Late Time *"
                type="time"
                name="lateTime"
                value={addConfig.lateTime}
                handlerChange={handlerChange}
              />

              <div className="md:col-span-2">
                <InputField
                  labelName="Half Leave *"
                  type="time"
                  name="halfLeave"
                  value={addConfig.halfLeave}
                  handlerChange={handlerChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton
                loading={loading}
                label={loading ? "Saving" : "Save"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

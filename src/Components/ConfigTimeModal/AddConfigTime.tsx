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

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllTimeConfig: () => void;
};

const optionData = [
  {
    id: 1,
    label: "Late",
    value: "late",
  },
  {
    id: 2,
    label: "Absent",
    value: "absent",
  },
];

const initialState = {
  configureType: "",
  configureTime: "",
};

export const AddConfigTime = ({
  setModal,
  handleGetAllTimeConfig,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addConfig, setAddConfig] = useState(initialState);

  const token = currentUser?.token;

  console.log(addConfig);

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddConfig({ ...addConfig, [name]: value.trim() });
  };

  console.log("submitted", addConfig);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/configureTime`,
        addConfig,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
      handleGetAllTimeConfig();
      setModal();
      toast.success("Configuration time saved successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs px-4   flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border  border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Config Time
              </Title>
            </div>

            <div className="mx-2 grid grid-cols sm:grid-cols-2 md:grid-cols-2 py-2 gap-3  ">
              
              <InputField
                labelName="Configure Time*"
                name="configureTime"
                type="time"
                value={addConfig.configureTime}
                handlerChange={handlerChange}
              />

              <OptionField
                labelName="Configure Type*"
                name="configureType"
                handlerChange={handlerChange}
                optionData={optionData}
                value={addConfig.configureType}
                inital="Please Select type"
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

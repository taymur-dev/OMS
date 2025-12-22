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
  configureType: string;
  configureTime: string;
};

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllTimeConfig: () => void;
  selectData: ALLCONFIGT | null;
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

export const EditConfigTime = ({
  setModal,
  handleGetAllTimeConfig,
  selectData,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [updateConfig, setUpdateAddConfig] = useState(selectData);

  const token = currentUser?.token;



  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateAddConfig({ ...updateConfig, [name]: value.trim() } as ALLCONFIGT);
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateTime/${updateConfig?.id}`,
        updateConfig,
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
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Update Config Time</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <OptionField
                labelName="Configure Type*"
                name="configureType"
                handlerChange={handlerChange}
                optionData={optionData}
                value={updateConfig?.configureType ?? ""}
                inital="Please Select type"
              />
              <InputField
                labelName="Configure Time*"
                name="configureTime"
                type="time"
                inputVal={updateConfig?.configureTime ?? ""}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Update Configuration"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

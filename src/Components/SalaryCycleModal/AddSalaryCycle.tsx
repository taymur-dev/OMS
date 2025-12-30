import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";

type AddAttendanceProps = {
  setModal: () => void;
};

const initialState = {
  salaryYear: "",
  salaryMonth: "",
};

export const AddSalaryCycle = ({ setModal }: AddAttendanceProps) => {
  const [addSalaryCycle, setAddSalaryCycle] = useState(initialState);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddSalaryCycle({ ...addSalaryCycle, [name]: value.trim() });
  };

  console.log("submitted", addSalaryCycle);

  const handlerSubmitted = async () => {};

  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Salary Cycle</Title>
            <div className="mx-2 flex flex-row items-center justify-center  flex-wrap gap-3  ">
              <InputField
                labelName="Year*"
                name="salaryYear"
                value={addSalaryCycle?.salaryYear}
                handlerChange={handlerChange}
              />
              <InputField
                labelName="Month*"
                name="salaryMonth"
                value={addSalaryCycle?.salaryMonth}
                handlerChange={handlerChange}
              />
            </div>
            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Run Cycle"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

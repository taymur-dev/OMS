import React, { useState } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
};

const initialState = {
  applicantName: "",
  fatherName: "",
  email: "",
  contactNo: "",
  dateApplied: "",
  job: "",
  interviewPhase: "",
};
export const AddApplicant = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [addApplicant, setAddApplicant] = useState(initialState);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddApplicant({ ...addApplicant, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/createCatagory`,
        addApplicant,
        { headers: { Authorization: token } }
      );
      console.log(res.data);

      toast.success(res.data.message);
      setModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem]   bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Applicant</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <InputField
                labelName="Applicant Name*"
                placeHolder="Enter the applicant name"
                type="text"
                name="applicantName"
                inputVal={addApplicant.applicantName}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Father Name*"
                placeHolder="Enter the  father name"
                type="text"
                name="fatherName"
                inputVal={addApplicant.fatherName}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Email*"
                placeHolder="Enter the  email"
                type="text"
                name="email"
                inputVal={addApplicant.email}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Contact No*"
                placeHolder="Enter the  contact no"
                type="number"
                name="contactNo"
                inputVal={addApplicant.contactNo}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Applied Date*"
                placeHolder="Enter the date"
                type="date"
                name="dateApplied"
                inputVal={addApplicant.dateApplied}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Job Title*"
                placeHolder="Enter the job title "
                type="text"
                name="job"
                inputVal={addApplicant.job}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Interview Phase*"
                placeHolder="Enter the interview phase"
                type="text"
                name="interviewPhase"
                inputVal={addApplicant.interviewPhase}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Applicant"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

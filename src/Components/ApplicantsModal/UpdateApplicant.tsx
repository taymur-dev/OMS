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
export const UpdateApplicant = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [updateApplicant, setUpdateApplicant] = useState(initialState);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateApplicant({ ...updateApplicant, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/createCatagory`,
        updateApplicant,
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
            <Title setModal={() => setModal()}>Update Applicant</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <InputField
                labelName="Applicant Name*"
                placeHolder="Enter the applicant name"
                type="text"
                name="applicantName"
                inputVal={updateApplicant.applicantName}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Father Name*"
                placeHolder="Enter the  father name"
                type="text"
                name="fatherName"
                inputVal={updateApplicant.fatherName}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Email*"
                placeHolder="Enter the  email"
                type="text"
                name="email"
                inputVal={updateApplicant.email}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Contact No*"
                placeHolder="Enter the  contact no"
                type="number"
                name="contactNo"
                inputVal={updateApplicant.contactNo}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Applied Date*"
                placeHolder="Enter the date"
                type="date"
                name="dateApplied"
                inputVal={updateApplicant.dateApplied}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Job Title*"
                placeHolder="Enter the job title "
                type="text"
                name="job"
                inputVal={updateApplicant.job}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Interview Phase*"
                placeHolder="Enter the interview phase"
                type="text"
                name="interviewPhase"
                inputVal={updateApplicant.interviewPhase}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Update Applicant"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

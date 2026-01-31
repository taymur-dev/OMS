import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

interface Applicant {
  id: number;
  applicant_name: string;
  fatherName?: string;
  email?: string;
  applicant_contact: string;
  applied_date: string;
  job: string;
  interviewPhase?: string;
  status: "pending" | "approved" | "rejected";
}

type UpdateApplicantProps = {
  setModal: () => void;
  applicant?: Applicant;
  refreshApplicants: () => void;
};

const defaultState = {
  id: 0,
  applicant_name: "",
  fatherName: "",
  email: "",
  applicant_contact: "",
  applied_date: "",
  job: "",
  interviewPhase: "",
  applicant_status: "pending" as "pending" | "approved" | "rejected",
};

export const UpdateApplicant = ({
  setModal,
  applicant,
  refreshApplicants,
}: UpdateApplicantProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateApplicant, setUpdateApplicant] = useState({
    ...defaultState,
    ...(applicant && {
      id: applicant.id,
      applicant_name: applicant.applicant_name,
      fatherName: applicant.fatherName,
      email: applicant.email,
      applicant_contact: applicant.applicant_contact,
      applied_date: applicant.applied_date,
      job: applicant.job,
      interviewPhase: applicant.interviewPhase,
      applicant_status: applicant.status,
    }),
  });

  useEffect(() => {
    if (applicant) {
      setUpdateApplicant({
        ...defaultState,
        id: applicant.id,
        applicant_name: applicant.applicant_name,
        fatherName: applicant.fatherName || "",
        email: applicant.email || "",
        applicant_contact: applicant.applicant_contact,
        applied_date: applicant.applied_date,
        job: applicant.job,
        interviewPhase: applicant.interviewPhase || "",
        applicant_status: applicant.status,
      });
    }
  }, [applicant]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdateApplicant((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/updateapplicant/${updateApplicant.id}`,
        updateApplicant,
        { headers: { Authorization: token } }
      );

      toast.success(res.data.message);
      refreshApplicants();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update applicant.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handlerSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT APPLICANT
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <InputField
              labelName="Applicant Name *"
              placeHolder="Enter the applicant name"
              type="text"
              name="applicant_name"
              value={updateApplicant.applicant_name}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Applicant Contact *"
              placeHolder="Enter contact number"
              type="text"
              name="applicant_contact"
              value={updateApplicant.applicant_contact}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Job Title *"
              placeHolder="Enter the job title"
              type="text"
              name="job"
              value={updateApplicant.job}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Applied Date *"
              placeHolder="Enter the date"
              type="date"
              name="applied_date"
              value={updateApplicant.applied_date}
              handlerChange={handlerChange}
            />

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-semibold">Applicant Status *</label>
              <select
                name="applicant_status"
                value={updateApplicant.applicant_status}
                onChange={handlerChange}
                className="border rounded-md p-2 text-sm"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};

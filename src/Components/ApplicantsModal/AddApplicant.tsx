import React, { useState, useEffect } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";

type AddApplicantProps = {
  setModal: () => void;
  refreshApplicants: () => void;
};

type Job = {
  id: number;
  job_title: string;
};

const currentDate = new Date().toLocaleDateString("en-CA");

const initialState = {
  applicant_name: "",
  fatherName: "",
  email: "",
  applicant_contact: "",
  applied_date: currentDate,
  job_id: "",
  interviewPhase: "",
  status: "pending",
};
export const AddApplicant = ({
  setModal,
  refreshApplicants,
}: AddApplicantProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [addApplicant, setAddApplicant] = useState(initialState);

  const [jobs, setJobs] = useState<Job[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddApplicant((prev) => ({ ...prev, [name]: value }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (addApplicant.applicant_contact.length !== 11) {
      toast.error("Contact number must be exactly 11 digits");
      return;
    }

    try {
      const payload = {
        ...addApplicant,
        applicant_status: "pending",
      };

      const res = await axios.post(
        `${BASE_URL}/api/admin/addapplicant`,
        payload,
        { headers: { Authorization: token } },
      );

      toast.success(res.data.message);
      refreshApplicants();
      setModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add applicant");
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getjob`, {
          headers: { Authorization: token },
        });
        setJobs(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, [token]);

  return (
    <div>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm px-4  flex items-center justify-center z-50">
        <div className="w-[42rem]   bg-white mx-auto rounded border  border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD APPLICANT
              </Title>
            </div>
            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3  ">
              <InputField
                labelName="Applicant Name *"
                placeHolder="Enter the applicant name"
                type="text"
                name="applicant_name"
                value={addApplicant.applicant_name}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Father Name *"
                placeHolder="Enter the  father name"
                type="text"
                name="fatherName"
                value={addApplicant.fatherName}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Email *"
                placeHolder="Enter the  email"
                type="text"
                name="email"
                value={addApplicant.email}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Contact No *"
                placeHolder="Enter 11 digit contact number"
                type="text"
                name="applicant_contact"
                value={addApplicant.applicant_contact}
                handlerChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 11) {
                    setAddApplicant((prev) => ({
                      ...prev,
                      applicant_contact: value,
                    }));
                  }
                }}
              />

              <InputField
                labelName="Applied Date *"
                placeHolder="Enter the date"
                type="date"
                name="applied_date"
                value={addApplicant.applied_date}
                handlerChange={handlerChange}
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold">Job Title *</label>

                <select
                  name="job_id"
                  value={addApplicant.job_id}
                  onChange={(e) =>
                    setAddApplicant({ ...addApplicant, job_id: e.target.value })
                  }
                  className="border rounded-md p-2 text-sm"
                  required
                >
                  <option value="">Select Job</option>

                  {Array.isArray(jobs) &&
                    jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.job_title}
                      </option>
                    ))}
                </select>
              </div>

              <InputField
                labelName="Interview Phase *"
                placeHolder="Enter the interview phase"
                type="text"
                name="interviewPhase"
                value={addApplicant.interviewPhase}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

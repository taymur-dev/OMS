import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { toast } from "react-toastify";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type EditProgressProps = {
  setModal: () => void;
  progressData: {
    id: number;
    employee_id: number;
    employeeName: string;
    projectId: number;
    projectName: string;
    date: string;
    note: string;
  };
  handleRefresh: () => void;
};

type UpdateProgressState = {
  employee_id: string;
  project: string;
  date: string;
  note: string;
};

type SelectProjectT = {
  projectId: number;
  projectName: string;
};

export const EditProgress = ({
  setModal,
  progressData,
  handleRefresh,
}: EditProgressProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateProgress, setUpdateProgress] = useState<UpdateProgressState>({
    employee_id: "",
    project: "",
    date: "",
    note: "",
  });

  const [allUsers, setAllUsers] = useState<[]>([]);
  const [selectProject, setSelectProject] = useState<SelectProjectT[] | null>(
    null,
  );

  useEffect(() => {
    if (progressData) {
      setUpdateProgress({
        employee_id: String(progressData.employee_id),
        project: progressData.projectName,
        date: progressData.date?.split("T")[0],
        note: progressData.note,
      });
    }
  }, [progressData]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUpdateProgress((prev) => ({ ...prev, [name]: value }));
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res?.data?.users || []);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const getAssignedProjects = useCallback(async () => {
    if (!updateProgress.employee_id) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/getAssignProjects/${updateProgress.employee_id}`,
        {
          headers: { Authorization: token },
        },
      );
      setSelectProject(res.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [token, updateProgress.employee_id]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    getAssignedProjects();
  }, [getAssignedProjects]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedProject = selectProject?.find(
        (p) => p.projectName === updateProgress.project,
      );

      if (!selectedProject) {
        toast.warning("Please select a valid project");

        return;
      }

      await axios.put(
        `${BASE_URL}/api/admin/updateProgress/${progressData.id}`,
        {
          employee_id: updateProgress.employee_id,
          projectId: selectedProject.projectId,
          date: updateProgress.date,
          note: updateProgress.note,
          progressStatus: "Y",
        },
        {
          headers: { Authorization: token },
        },
      );

      handleRefresh();
      toast.success("Progress updated successfully");

      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update progress");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Edit Progress
            </Title>
          </div>

          <div className="mx-2  py-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
            {currentUser?.role === "admin" && (
              <UserSelect
                labelName="Employees*"
                name="employee_id"
                value={updateProgress.employee_id}
                handlerChange={handlerChange}
                optionData={allUsers}
              />
            )}

            <OptionField
              labelName="Project*"
              name="project"
              value={updateProgress.project}
              handlerChange={handlerChange}
              optionData={selectProject?.map((p) => ({
                id: p.projectId,
                label: p.projectName,
                value: p.projectName,
              }))}
              inital="Please Select Project"
            />

            <InputField
              labelName="End Date*"
              name="date"
              type="date"
              handlerChange={handlerChange}
              value={updateProgress.date}
            />

            <InputField
              labelName="Note*"
              name="note"
              handlerChange={handlerChange}
              value={updateProgress.note}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};

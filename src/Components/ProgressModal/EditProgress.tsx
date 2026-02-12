import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { TextareaField } from "../InputFields/TextareaField";
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

type UserT = {
  id: number;
  employeeName?: string;
  name?: string;
  loginStatus: string;
  role: string;
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
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const [updateProgress, setUpdateProgress] = useState<UpdateProgressState>({
    employee_id: "",
    project: "",
    date: "",
    note: "",
  });

  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [selectProject, setSelectProject] = useState<SelectProjectT[] | null>(
    null,
  );

  useEffect(() => {
    if (progressData && progressData.date) {
      const dateObj = new Date(progressData.date);

      const formattedDate = dateObj.toLocaleDateString("en-CA");

      setUpdateProgress({
        employee_id: String(progressData.employee_id),
        project: progressData.projectName,
        date: formattedDate,
        note: progressData.note,
      });
    }
  }, [progressData]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "note") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    setUpdateProgress((prev) => ({ ...prev, [name]: updatedValue }));
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

    setLoading(true);

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
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      handleRefresh();
      toast.success("Progress updated successfully");

      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to update progress";

        if (error.response?.status === 409) {
          toast.error(message, {
            toastId: "duplicate-edit-error",
            autoClose: 5000,
          });
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const userOptions = allUsers
    .filter((u) => u.role === "user" && u.loginStatus === "Y")
    .map((u) => ({
      id: u.id,
      value: String(u.id),
      label: u.employeeName || u.name || "Unknown User",
    }));

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded border border-indigo-900">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT PROGRESS
            </Title>
          </div>

          <div className="mx-2  py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
            {currentUser?.role === "admin" && (
              <UserSelect
                labelName="Employees*"
                name="employee_id"
                value={updateProgress.employee_id}
                handlerChange={handlerChange}
                optionData={userOptions}
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
              labelName="Date*"
              name="date"
              type="date"
              handlerChange={handlerChange}
              value={updateProgress.date}
            />

            <TextareaField
              labelName="Note*"
              name="note"
              handlerChange={handlerChange}
              inputVal={updateProgress.note}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

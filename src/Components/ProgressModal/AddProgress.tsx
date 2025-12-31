import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { OptionField } from "../InputFields/OptionField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddProgressProps = {
  setModal: () => void;
  handleRefresh: () => void;
};

type UserT = {
  id: number | string;
  employeeName?: string;
  name?: string;
  loginStatus?: string;
  role: string;
};

type ProjectT = {
  id?: number;
  projectId?: number;
  projectName: string;
  projectCategory?: string;
};

type AddProgressType = {
  employee_id: string;
  projectId: string;
  date: string;
  note: string;
};

const initialState: AddProgressType = {
  employee_id: "",
  projectId: "",
  date: "",
  note: "",
};

export const AddProgress = ({ setModal, handleRefresh }: AddProgressProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [addProgress, setAddProgress] = useState<AddProgressType>(initialState);
  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [selectProject, setSelectProject] = useState<ProjectT[]>([]);

  const getAllUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res.data?.users ?? []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [token]);

  const fetchProjectsByUser = useCallback(
    async (userId: string | number) => {
      if (!token || !userId) return;
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/getAssignProjects/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const projects = res.data?.projects || res.data?.data || res.data || [];
        setSelectProject(Array.isArray(projects) ? projects : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setSelectProject([]);
      }
    },
    [token]
  );

  useEffect(() => {
    if (isAdmin) getAllUsers();
  }, [isAdmin, getAllUsers]);

  useEffect(() => {
    if (!currentUser || !token || isAdmin) return;

    const fetchMyProjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/getAssignProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projects = res.data || [];
        setSelectProject(Array.isArray(projects) ? projects : []);
      } catch (err) {
        console.error("Error fetching my projects:", err);
        setSelectProject([]);
      }
    };

    setAddProgress((prev) => ({
      ...prev,
      employee_id: String(currentUser.id),
    }));
    fetchMyProjects();
  }, [currentUser, token, isAdmin]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setAddProgress((prev) => ({ ...prev, [name]: value }));

    if (name === "employee_id" && value) {
      fetchProjectsByUser(value);
      setAddProgress((prev) => ({ ...prev, projectId: "" }));
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addProgress.employee_id) {
      alert("Please select an employee");
      return;
    }

    if (!addProgress.projectId || !addProgress.date || !addProgress.note) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/admin/addProgress`,
        { ...addProgress, projectId: Number(addProgress.projectId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleRefresh();
      setModal();
      setAddProgress(initialState);
    } catch (err) {
      console.error("Error adding progress:", err);
      alert("Failed to add progress");
    }
  };

  const userOptions = isAdmin
    ? allUsers
        .filter(
          (u) => u.role === "user" && u.loginStatus === "Y" && u.id != null
        )
        .map((u) => ({
          id: Number(u.id),
          name: u.employeeName || u.name || "User",
          value: String(u.id),
          label: u.employeeName || u.name || "User",
          loginStatus: u.loginStatus || "Y",
          projectName: "",
          role: u.role,
        }))
    : [];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Progress</Title>

          <div className="mx-2 space-y-2">
            {isAdmin && (
              <UserSelect
                labelName="Employees*"
                name="employee_id"
                value={addProgress.employee_id}
                handlerChange={handlerChange}
                disabled={false}
                optionData={userOptions}
              />
            )}

            <OptionField
              labelName="Project*"
              name="projectId"
              value={addProgress.projectId}
              handlerChange={handlerChange}
              optionData={selectProject.map((p, index) => ({
                id: p.projectId ?? p.id ?? index + 1,
                value: String(p.projectId ?? p.id ?? ""),
                label: p.projectCategory
                  ? `${p.projectName} (${p.projectCategory})`
                  : p.projectName,
              }))}
              inital={
                selectProject.length
                  ? "Please Select Project"
                  : "No projects available"
              }
            />

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              handlerChange={handlerChange}
              value={addProgress.date}
            />

            <TextareaField
              labelName="Note*"
              name="note"
              handlerChange={handlerChange}
              inputVal={addProgress.note}
            />
          </div>

          <div className="flex justify-center gap-2 m-2">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Progress" />
          </div>
        </form>
      </div>
    </div>
  );
};

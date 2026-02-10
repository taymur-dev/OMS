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
import { toast } from "react-toastify";

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

const today = new Date();
const currentDate = today.toLocaleDateString("en-CA");

type AddProgressType = {
  employee_id: string;
  projectId: string;
  date: string;
  note: string;
};

const initialState: AddProgressType = {
  employee_id: "",
  projectId: "",
  date: currentDate,
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
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const projects = res.data?.projects || res.data?.data || res.data || [];
        setSelectProject(Array.isArray(projects) ? projects : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setSelectProject([]);
      }
    },
    [token],
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
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "note") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    setAddProgress((prev) => ({ ...prev, [name]: updatedValue }));

    if (name === "employee_id" && value) {
      fetchProjectsByUser(value);
      setAddProgress((prev) => ({ ...prev, projectId: "" }));
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !addProgress.employee_id ||
      !addProgress.projectId ||
      !addProgress.date ||
      !addProgress.note
    ) {
      return toast.error("Please fill all required fields", {
        toastId: "required-fields",
      });
    }

    try {
      await axios.post(
        `${BASE_URL}/api/admin/addProgress`,
        { ...addProgress, projectId: Number(addProgress.projectId) },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Progress added successfully!", {
        toastId: "add-progress-success",
      });

      handleRefresh();
      setModal();
      setAddProgress(initialState);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Failed to add progress";
        toast.error(message, { toastId: "add-progress-error" });
      } else {
        toast.error("Something went wrong!", { toastId: "add-progress-error" });
      }
    }
  };

  const userOptions = isAdmin
    ? allUsers
        .filter(
          (u) => u.role === "user" && u.loginStatus === "Y" && u.id != null,
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur  px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white rounded border border-indigo-900">
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
              ADD PROGRESS
            </Title>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 mx-2 py-2 space-y-2">
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

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};

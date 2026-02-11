import React, { FormEvent, useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import axios from "axios";
import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";

type AddProjectProps = {
  setModal: () => void;
  handleGetAllProjects: () => void;
};

const currentDate = new Date().toLocaleDateString("sv-SE");

type AllCategoryT = {
  id: number;
  categoryName: string;
};

const initialState = {
  projectName: "",
  projectCategory: "",
  description: "",
  startDate: currentDate,
  endDate: currentDate,
  completionStatus: "New", // default
};

export const AddProject = ({
  setModal,
  handleGetAllProjects,
}: AddProjectProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [addProject, setAddProject] = useState(initialState);
  const [categories, setCategories] = useState<AllCategoryT[] | null>(null);
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "projectName") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "description") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    setAddProject({ ...addProject, [name]: updatedValue });
  };

  const handleGetAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    handleGetAllCategories();
  }, [handleGetAllCategories]);

  const handlerSubmitted = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addProject`,
        addProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await handleGetAllProjects();
      console.log(res);

      setModal();
      toast.success("Project submitted successfully!", {
        toastId: "added success",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error(
            error.response.data.message ||
              "Project with this name and category already exists",
            { toastId: "duplicate-project" },
          );
        } else {
          toast.error("Failed to add project", { toastId: "failed" });
        }
      } else {
        console.error(error);
        toast.error("An unexpected error occurred", { toastId: "failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm px-4  flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white rounded shadow-lg border border-indigo-900 overflow-hidden">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          {/* Header */}
          <div className="bg-indigo-900 px-6 ">
            <Title
              setModal={setModal}
              className="text-white text-xl font-semibold"
            >
              ADD PROJECT
            </Title>
          </div>

          {/* Body */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            <OptionField
              labelName="Project Category *"
              name="projectCategory"
              value={addProject.projectCategory}
              handlerChange={handlerChange}
              optionData={categories?.map((category) => ({
                id: category.id,
                label: category.categoryName,
                value: category.categoryName,
              }))}
              inital="Select Project Category"
            />

            <InputField
              labelName="Project Name *"
              type="text"
              name="projectName"
              value={addProject.projectName}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Start Date *"
              type="date"
              name="startDate"
              value={addProject.startDate}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="End Date *"
              type="date"
              name="endDate"
              value={addProject.endDate}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Project Description"
              name="description"
              handlerChange={handlerChange}
              inputVal={addProject.description}
              className="col-span-1 md:col-span-2"
            />

            <OptionField
              labelName="Completion Status *"
              name="completionStatus"
              value={addProject.completionStatus}
              handlerChange={handlerChange}
              optionData={[
                { id: 1, label: "New", value: "New" },
                { id: 2, label: "Working", value: "Working" },
                { id: 3, label: "Complete", value: "Complete" },
              ]}
              inital="Select Status"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-indigo-900 border-t border-indigo-900 rounded">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Saving" : "Save"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

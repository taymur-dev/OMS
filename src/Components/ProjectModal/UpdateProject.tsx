import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AllProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  completionStatus: string;
};

type AllCategoryT = {
  id: number;
  categoryName: string;
};

type UpdateProjectProps = {
  setModal: () => void;
  selectProject: AllProjectT | null;
  onUpdate?: (updatedProject: AllProjectT) => void;
};

export const UpdateProject = ({
  setModal,
  selectProject,
  onUpdate,
}: UpdateProjectProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateProject, setUpdateProject] = useState(selectProject);
  const [categories, setCategories] = useState<AllCategoryT[] | null>(null);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateProject({ ...updateProject, [name]: value } as AllProjectT);
  };

  const handleGetAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    handleGetAllCategories();
  }, [handleGetAllCategories]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateProject) return;

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateProject/${updateProject.id}`,
        updateProject,
        { headers: { Authorization: `Bearer: ${token}` } }
      );

      if (res.status === 200) {
        onUpdate?.(res.data.project);
        setModal();
      }
    } catch (error: unknown) {
      console.error("Update failed:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-indigo-500 overflow-hidden">
        <form onSubmit={handlerSubmitted}>
          {/* Header */}
          <div className="bg-blue-600 px-6">
            <Title
              setModal={setModal}
              className="text-white text-xl font-semibold"
            >
              Update Project
            </Title>
          </div>

          {/* Form Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <OptionField
              labelName="Project Category*"
              name="projectCategory"
              value={updateProject?.projectCategory ?? ""}
              handlerChange={handlerChange}
              optionData={categories?.map((category) => ({
                id: category.id,
                label: category.categoryName,
                value: category.categoryName,
              }))}
              inital="Please Select Project Category"
            />

            <InputField
              labelName="Project Name*"
              placeHolder="Enter the Project Name"
              type="text"
              name="projectName"
              value={updateProject?.projectName}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Start Date*"
              placeHolder="Select Start Date"
              type="date"
              name="startDate"
              value={updateProject?.startDate ?? ""}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="End Date*"
              placeHolder="Select End Date"
              type="date"
              name="endDate"
              value={updateProject?.endDate ?? ""}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Project Description"
              name="description"
              placeHolder="Enter Project Description..."
              handlerChange={handlerChange}
              inputVal={updateProject?.description ?? ""}
            />

            <OptionField
              labelName="Completion Status*"
              name="completionStatus"
              value={updateProject?.completionStatus ?? "New"}
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
          <div className="flex justify-end gap-4 px-6 py-4 bg-blue-600 border-t border-indigo-500 rounded-b-xl">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};

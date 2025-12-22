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
        headers: { Authorization: token },
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
        { headers: { Authorization: token } }
      );

      if (res.status === 200) {
        onUpdate?.(res.data.project); // update parent state instantly
        setModal();
      }
    } catch (error: unknown) {
      console.error("Update failed:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] min-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Update Project</Title>

          <div className="mx-2 flex-wrap gap-3">
            <InputField
              labelName="Project Name*"
              placeHolder="Enter the Project Name"
              type="text"
              name="projectName"
              inputVal={updateProject?.projectName}
              handlerChange={handlerChange}
            />

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

            <TextareaField
              labelName="Project Description"
              name="description"
              placeHolder="Enter Project Description..."
              handlerChange={handlerChange}
              inputVal={updateProject?.description ?? ""}
            />

            <InputField
              labelName="Start Date*"
              placeHolder="Enter the Start Date"
              type="date"
              name="startDate"
              inputVal={updateProject?.startDate ?? ""}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="End Date*"
              placeHolder="Enter the End Date"
              type="date"
              name="endDate"
              inputVal={updateProject?.endDate ?? ""}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Project" />
          </div>
        </form>
      </div>
    </div>
  );
};

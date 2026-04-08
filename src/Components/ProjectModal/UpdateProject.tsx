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
import { toast } from "react-toastify";

type AllProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  deadlineDate?: string;
  completionStatus: string;
  isOnGoing: number;
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

  const [updateProject, setUpdateProject] = useState(() =>
    selectProject
      ? { ...selectProject, isOnGoing: !!selectProject.isOnGoing }
      : null,
  );

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AllCategoryT[] | null>(null);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setUpdateProject((prev) => {
      if (!prev) return prev;

      let updatedValue = value;

      if (name === "projectName") {
        updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
      }

      if (name === "description") {
        updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
      }

      // 👉 STATUS LOGIC
      if (name === "completionStatus") {
        return {
          ...prev,
          completionStatus: value,
          isOnGoing: value !== "Completed",
          endDate: value === "Completed" ? prev.endDate : "",
        };
      }

      // ✅ FIX: handle deadlineDate properly
      if (name === "deadlineDate") {
        return {
          ...prev,
          deadlineDate: value,
        };
      }

      return { ...prev, [name]: updatedValue };
    });
  };

  const handleGetAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    handleGetAllCategories();
  }, [handleGetAllCategories]);

  useEffect(() => {
    if (selectProject) {
      setUpdateProject({
        ...selectProject,
        isOnGoing: !!selectProject.isOnGoing,
        deadlineDate: selectProject.deadlineDate ?? "",
      });
    }
  }, [selectProject]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateProject) return;

    // ✅ VALIDATION: deadline vs start date
    if (
      updateProject.completionStatus === "Working" &&
      updateProject.deadlineDate &&
      new Date(updateProject.deadlineDate) < new Date(updateProject.startDate)
    ) {
      toast.error("Deadline cannot be before start date", {
        toastId: "deadline-error-update",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ FIX: convert isOnGoing to number for backend
      const payload = {
        ...updateProject,
        isOnGoing: updateProject.isOnGoing ? 1 : 0,
      };

      const res = await axios.put(
        `${BASE_URL}/api/admin/updateProject/${updateProject.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.status === 200) {
        onUpdate?.(res.data.project);
        setModal();
        toast.success("Project updated successfully!", {
          toastId: "update-success",
        });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error(
            error.response.data.message || "Duplicate project detected",
            {
              toastId: "update-duplicate",
            },
          );
        } else {
          toast.error("Failed to update project", {
            toastId: "update-failed",
          });
        }
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          {/* Header */}
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={setModal}
              className="text-white text-xl font-semibold"
            >
              EDIT PROJECT
            </Title>
          </div>

          {/* Form Body */}
          <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6">
            <OptionField
              labelName="Project Category *"
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
              labelName="Project Name *"
              type="text"
              name="projectName"
              value={updateProject?.projectName}
              handlerChange={handlerChange}
              minLength={3}
              maxLength={50}
            />

            <InputField
              labelName="Start Date *"
              type="date"
              name="startDate"
              value={updateProject?.startDate ?? ""}
              handlerChange={handlerChange}
            />

            <div className="md:col-span-2 flex items-center justify-center gap-2">
              <input
                type="checkbox"
                name="isOnGoing"
                checked={updateProject?.isOnGoing || false}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setUpdateProject((prev) => {
                    if (!prev) return prev;

                    return {
                      ...prev,
                      isOnGoing: checked,
                      endDate: checked ? "" : prev.endDate,
                      completionStatus: checked ? "New" : prev.completionStatus,
                    };
                  });
                }}
              />
              <label className="text-sm font-medium">On Going</label>
            </div>

            <InputField
              labelName="End Date *"
              type="date"
              name="endDate"
              value={updateProject?.endDate ?? ""}
              handlerChange={handlerChange}
              disabled={updateProject?.isOnGoing}
            />

            <OptionField
              labelName="Completion Status *"
              name="completionStatus"
              value={updateProject?.completionStatus ?? "New"}
              handlerChange={handlerChange}
              optionData={[
                { id: 1, label: "New", value: "New" },
                { id: 2, label: "Working", value: "Working" },
                { id: 3, label: "Completed", value: "Completed" },
              ]}
              inital="Select Status"
            />

            {/* ✅ NEW FIELD */}
            <div className="md:col-span-2">
              {updateProject?.completionStatus === "Working" && (
                <InputField
                  labelName="Deadline Date *"
                  type="date"
                  name="deadlineDate"
                  value={updateProject?.deadlineDate ?? ""}
                  handlerChange={handlerChange}
                />
              )}
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Project Description"
                name="description"
                handlerChange={handlerChange}
                inputVal={updateProject?.description ?? ""}
                minLength={3}
                maxLength={250}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 px-4 py-6 bg-white rounded">
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

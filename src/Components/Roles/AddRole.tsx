import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

type AddRoleProps = {
  handlerGetRoles: () => void;
  setModal: () => void;
};

const initialState = {
  roleName: "",
};

export const AddRole = ({ handlerGetRoles, setModal }: AddRoleProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [roleData, setRoleData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Sanitization: Only letters and spaces allowed
    const updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);

    setRoleData({ ...roleData, [name]: updatedValue });
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roleData.roleName.trim()) {
      return toast.error("Role Name is required", {
        toastId: "required-role-name",
      });
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createRole`,
        roleData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success(res.data.message || "Role added successfully", {
        toastId: "add-role-success",
      });

      handlerGetRoles();
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong", {
          toastId: "role-error",
        });
      } else {
        toast.error("Unexpected error occurred", {
          toastId: "role-error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[28rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form
          onSubmit={handlerSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD ROLE
            </Title>
          </div>

          <div className="mx-2 flex-wrap gap-3 py-5">
            <InputField
              labelName="Role Name *"
              type="text"
              name="roleName"
              value={roleData.roleName}
              handlerChange={handlerChange}
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-white">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};

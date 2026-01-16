import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { UserSelect } from "../InputFields/UserSelect";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type EditAdvanceSalaryProps = {
  setModal: () => void;
  advanceData: {
    id: number;
    employee_id: number;
    employee_name: string;
    date: string;
    amount: number;
    approvalStatus: string;
    description: string;
  };
  handleRefresh: () => void;
};

type UpdateAdvanceSalaryState = {
  employee_id: string;
  date: string;
  amount: string;
  approvalStatus: string;
  description: string;
};

export const EditAdvanceSalary = ({
  setModal,
  advanceData,
  handleRefresh,
}: EditAdvanceSalaryProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updateAdvance, setUpdateAdvance] = useState<UpdateAdvanceSalaryState>({
    employee_id: "",
    date: "",
    amount: "",
    approvalStatus: "Pending",
    description: "",
  });

  const [allUsers, setAllUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (advanceData) {
      setUpdateAdvance({
        employee_id: String(advanceData.employee_id),
        date: advanceData.date.split("T")[0],
        amount: String(advanceData.amount),
        approvalStatus: advanceData.approvalStatus || "Pending",
        description: advanceData.description || "",
      });
    }
  }, [advanceData]);

  useEffect(() => {
    if (currentUser?.role !== "admin") return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(res.data.users || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [token, currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdateAdvance((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.role || currentUser.role !== "admin") {
      toast.error("Only admins can update advance salary");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateAdvanceSalary/${advanceData.id}`,
        {
          employee_id: updateAdvance.employee_id,
          date: updateAdvance.date,
          amount: Number(updateAdvance.amount),
          approvalStatus: updateAdvance.approvalStatus,
          description: updateAdvance.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Advance salary updated successfully");
      handleRefresh();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update advance salary");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[36rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-500 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Edit Advance Salary
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-2 py-2 gap-3 mt-2">
            {currentUser?.role === "admin" && (
              <UserSelect
                labelName="Employee*"
                name="employee_id"
                value={updateAdvance.employee_id}
                handlerChange={handleChange}
                optionData={allUsers.map((u) => ({
                  id: u.id,
                  value: String(u.id),
                  label: u.name,
                }))}
              />
            )}

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              value={updateAdvance.date}
              handlerChange={handleChange}
            />

            <InputField
              labelName="Amount*"
              name="amount"
              type="number"
              value={updateAdvance.amount}
              handlerChange={handleChange}
            />

            <InputField
              labelName="Description"
              name="description"
              value={updateAdvance.description}
              handlerChange={handleChange}
            />

            <OptionField
              labelName="Approval*"
              name="approvalStatus"
              value={updateAdvance.approvalStatus}
              handlerChange={handleChange}
              optionData={[
                { id: 1, value: "Pending", label: "Pending" },
                { id: 2, value: "Approved", label: "Approved" },
                { id: 3, value: "Rejected", label: "Rejected" },
              ]}
              inital="Select Approval"
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-500">
            <CancelBtn setModal={setModal} />
            <AddButton label="Updatee" />
          </div>
        </form>
      </div>
    </div>
  );
};

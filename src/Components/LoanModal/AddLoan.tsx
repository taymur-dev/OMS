import React, { useCallback, useEffect, useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  handleRefresh: () => void;
};

type AddLoanType = {
  employee_id: string;
  contact: string;
  loanAmount: number;
  deduction: number;
  remainingAmount: number;
  applyDate: string;
};

type User = {
  id: string | number;
  name: string;
  contact: string;
  loginStatus: "Y" | "N";
  role: string;
};

const currentDate = new Date().toLocaleDateString("sv-SE");

const initialState = {
  employee_id: "",
  contact: "",
  loanAmount: "",
  deduction: "",
  remainingAmount: "",
  applyDate: currentDate,
};

export const AddLoan = ({ setModal, handleRefresh }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [addLoan, setAddLoan] = useState(initialState);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  /* ================= USER ROLE PREFILL ================= */
  useEffect(() => {
    if (currentUser?.role === "user") {
      setAddLoan((prev) => ({
        ...prev,
        employee_id: String(currentUser.id),
        contact: currentUser.contact || "",
      }));
    }
  }, [currentUser]);

  /* ================= INPUT HANDLER ================= */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "contact") {
      updatedValue = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "loanAmount") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    if (name === "remainingAmount") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    if (name === "deduction") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setAddLoan((prev) => ({ ...prev, [name]: updatedValue }));
  };

  /* ================= USER SELECT HANDLER (FIXED) ================= */
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const selectedUser = allUsers.find(
      (user) => String(user.id) === selectedId,
    );

    setAddLoan((prev) => ({
      ...prev,
      employee_id: selectedId,
      contact: selectedUser?.contact || "",
    }));
  };

  /* ================= FETCH USERS ================= */
  const getAllUsers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get<{ users: User[] }>(
        `${BASE_URL}/api/admin/getUsers`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAllUsers(res.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setAllUsers([]);
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  /* ================= REMAINING AMOUNT ================= */
  useEffect(() => {
    const loan = Number(addLoan.loanAmount) || 0;
    const deduction = Number(addLoan.deduction) || 0;

    const remaining = loan - deduction;

    setAddLoan((prev) => ({
      ...prev,
      remainingAmount: remaining > 0 ? remaining.toString() : "0",
    }));
  }, [addLoan.loanAmount, addLoan.deduction]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token)
      return toast.error("Unauthorized", { toastId: "loan-unauthorized" });

    if (!addLoan.employee_id || !addLoan.loanAmount || !addLoan.applyDate)
      return toast.error("Please fill all required fields", {
        toastId: "required",
      });

    const loanAmount = Number(addLoan.loanAmount);
    if (loanAmount <= 0)
      return toast.error("Loan amount must be greater than 0", {
        toastId: "error",
      });

    const payload: AddLoanType = {
      employee_id: addLoan.employee_id,
      contact: addLoan.contact,
      loanAmount,
      deduction: Number(addLoan.deduction) || 0,
      remainingAmount: Number(addLoan.remainingAmount) || 0,
      applyDate: addLoan.applyDate,
    };

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/addLoan`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Loan added successfully", { toastId: "success" });
      setModal();
      handleRefresh();
      setAddLoan(initialState);
    } catch (error: unknown) {
      console.error("Add loan error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add loan", {
          toastId: "failed",
        });
      } else {
        toast.error("Something went wrong", { toastId: "wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  const activeUsers = allUsers.filter(
    (user) => user.loginStatus === "Y" && user.role === "user",
  );

  /* ================= UI ================= */
  return (
    <div
      className="fixed inset-0 bg-opacity-50 px-4  backdrop-blur-xs flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Loan
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            {currentUser?.role === "admin" && (
              <div className="mb-4">
                <UserSelect
                  labelName="Employees *"
                  name="employee_id"
                  value={addLoan.employee_id}
                  handlerChange={handleUserSelect}
                  optionData={activeUsers.map((user) => ({
                    value: String(user.id),
                    label: user.name,
                  }))}
                />
              </div>
            )}

            {currentUser?.role === "user" && (
              <InputField
                labelName="Employee *"
                name="employee_id"
                value={currentUser.name || ""}
                handlerChange={handleInputChange}
                readOnly
              />
            )}

            <InputField
              labelName="Contact"
              type="number"
              name="contact"
              value={addLoan.contact}
              handlerChange={handleInputChange}
              readOnly
            />

            <InputField
              labelName="Apply Date *"
              type="date"
              name="applyDate"
              value={addLoan.applyDate}
              handlerChange={handleInputChange}
            />

            <InputField
              labelName="Loan Amount *"
              type="number"
              name="loanAmount"
              value={addLoan.loanAmount}
              handlerChange={handleInputChange}
            />

            <InputField
              labelName="Deduction *"
              type="number"
              name="deduction"
              value={addLoan.deduction}
              handlerChange={handleInputChange}
            />

            <InputField
              labelName="Remaining Amount"
              type="number"
              name="remainingAmount"
              value={addLoan.remainingAmount}
              handlerChange={() => {}}
              readOnly
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
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

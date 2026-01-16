import { useEffect, useState, useCallback } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { UserSelect } from "../InputFields/UserSelect";

const currentDate = new Date().toLocaleDateString("en-CA");

type Employee = {
  employee_id: string;
  employeeName: string;
  email: string;
  contact: string;
  position: string;
  date: string;
};

type UserOption = {
  id: number;
  name: string;
  email: string;
  contact: string;
  position?: string;
  role: string;
  loginStatus: string;
};

type LifeLine = {
  id: number;
  employeeName: string;
  email: string;
  contact: string;
  position: string;
  date: string;
};

type AddEmployeeLifeLineProps = {
  setModal: () => void;
  onAdd: (newLifeLine: LifeLine) => void;
};

const initialState: Employee = {
  employee_id: "",
  employeeName: "",
  email: "",
  contact: "",
  position: "",
  date: currentDate,
};

export const AddEmployeeLifeLine = ({
  setModal,
  onAdd,
}: AddEmployeeLifeLineProps) => {
  const [allUsers, setAllUsers] = useState<UserOption[]>([]);
  const [addEmployee, setAddEmployee] = useState<Employee>(initialState);

  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);

    const selectedUser = allUsers.find((u) => u.id === selectedId);
    if (!selectedUser) return;

    setAddEmployee((prev) => ({
      ...prev,
      employee_id: selectedUser.id.toString(),
      employeeName: selectedUser.name,
      email: selectedUser.email || "",
      contact: selectedUser.contact || "",
      position: selectedUser.position || "",
    }));
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers = res.data.users.filter(
        (u: UserOption) => u.role === "user" && u.loginStatus === "Y"
      );

      setAllUsers(filteredUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to fetch users");
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addEmpll`,
        addEmployee,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.newLifeLine) {
        onAdd(res.data.newLifeLine);
        toast.success(res.data.message);
      }

      setAddEmployee(initialState);
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to add lifeline"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Employee LifeLine
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-2 py-5 gap-3">
            <UserSelect
              labelName="Select Employee*"
              name="employee_id"
              handlerChange={handleEmployeeSelect}
              optionData={allUsers.map((u) => ({
                value: u.id.toString(),
                label: u.name,
              }))}
              value={addEmployee.employee_id}
            />

            <InputField
              labelName="Employee Email*"
              name="email"
              value={addEmployee.email}
              readOnly
            />

            <InputField
              labelName="Employee Contact*"
              name="contact"
              value={addEmployee.contact}
              readOnly
            />

            <InputField
              labelName="Employee Position*"
              name="position"
              value={addEmployee.position}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              value={addEmployee.date}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};

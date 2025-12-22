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

const currentDate = new Date().toISOString().split("T")[0];

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
  loginStatus: string;
  projectName: string;
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
  editData?: LifeLine;
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
  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddEmployee({ ...addEmployee, [name]: value });
  };

  const handleEmployeeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedUser = allUsers.find(
      (user) => user.id.toString() === selectedId
    );

    if (selectedUser) {
      setAddEmployee({
        ...addEmployee,
        employee_id: selectedUser.id.toString(),
        employeeName: selectedUser.name,
        email: "",
        contact: "",
        position: "",
      });
    }
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res.data.users);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addEmpll`,
        addEmployee,
        { headers: { Authorization: token } }
      );

      if (res.data?.newLifeLine) {
        onAdd(res.data.newLifeLine);
        toast.success(res.data.message);
      }

      setModal();
      setAddEmployee(initialState);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Employee LifeLine</Title>
          <div className="mx-2 flex-wrap gap-3">
            <UserSelect
              labelName="Select Employee*"
              name="employee_id"
              handlerChange={handleEmployeeSelect}
              optionData={allUsers}
              value={addEmployee.employee_id}
            />
            <InputField
              labelName="Employee Email*"
              placeHolder="Enter the Employee Email"
              type="text"
              name="email"
              handlerChange={handlerChange}
              inputVal={addEmployee.email}
            />
            <InputField
              labelName="Employee Contact*"
              placeHolder="Enter the Employee Contact"
              type="number"
              name="contact"
              handlerChange={handlerChange}
              inputVal={addEmployee.contact}
            />
            <InputField
              labelName="Employee Position*"
              placeHolder="Enter the Employee Position"
              type="text"
              name="position"
              handlerChange={handlerChange}
              inputVal={addEmployee.position}
            />
            <InputField
              labelName="Date*"
              placeHolder="Enter the Date"
              type="date"
              name="date"
              handlerChange={handlerChange}
              inputVal={addEmployee.date}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Add Employee" />
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useState } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import { UserSelect } from "../InputFields/UserSelect";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";
import { InputField } from "../InputFields/InputField";

type AddAttendanceProps = {
  setModal: () => void;
};

const initialState = {
  employee_name: "",
  employeeSalary: "",
  overtimeAllowance: "",
  projectAllowance: "",
  empMonthAllowance: "",
  medicalAllowance: "",
  date: "",
  withEffectDate: "",
};
export const EditConfigEmpSalary = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addConfigEmployee, setAddConfigEmployee] = useState(initialState);

  const [allUsers, setAllUsers] = useState([]);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    setAddConfigEmployee({ ...addConfigEmployee, [name]: value });
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: token,
        },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        employeeName: addConfigEmployee.employee_name,
        employeeSalary: addConfigEmployee.employeeSalary,
        overtimeAllowance: addConfigEmployee.overtimeAllowance,
        projectAllowance: addConfigEmployee.projectAllowance,
        empMonthAllowance: addConfigEmployee.empMonthAllowance,
        medicalAllowance: addConfigEmployee.medicalAllowance,
        date: addConfigEmployee.date,
        withEffectDate: addConfigEmployee.withEffectDate,
      };

      const res = await axios.put(
        `${BASE_URL}/api/admin/updatesalaries`,
        payload,
        {
          headers: { Authorization: token },
        }
      );

      if (res.status === 200) {
        alert("Salary updated successfully!");
        setModal();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Something went wrong while updating salary"
        );
      } else {
        console.error(error);
        alert("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[39rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Update Salary</Title>
            <div className="mx-2 flex-wrap gap-3  ">
              <UserSelect
                labelName="Employee Name*"
                name="employeeName"
                value={addConfigEmployee.employee_name}
                handlerChange={handlerChange}
                optionData={allUsers}
              />

              <InputField
                labelName="Employee Salary*"
                name="employeeSalary"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.employeeSalary}
              />

              <InputField
                labelName="Over Time Allowance*"
                name="overtimeAllowance"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.overtimeAllowance}
              />

              <InputField
                labelName="Project Allowance*"
                name="projectAllowance"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.projectAllowance}
              />

              <InputField
                labelName="Employee Month Allowance*"
                name="empMonthAllowance"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.empMonthAllowance}
              />

              <InputField
                labelName="Medical Allowance*"
                name="medicalAllowance"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.medicalAllowance}
              />

              <InputField
                labelName="Date*"
                name="date"
                type="date"
                handlerChange={handlerChange}
                value={addConfigEmployee.date}
              />

              <InputField
                labelName="With Effect From Date*"
                name="withEffectDate"
                type="number"
                handlerChange={handlerChange}
                value={addConfigEmployee.withEffectDate}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"update Salary"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

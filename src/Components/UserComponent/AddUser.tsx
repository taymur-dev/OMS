import { useEffect, useState } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { OptionField } from "../InputFields/OptionField";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

export interface IAddUserValues {
  userId: number | string;
  name: string;
  email: string;
  contact: string;
  cnic: string;
  address: string;
  date: string;
  role: string;
  password: string;
  confirmPassword?: string;
}

export interface IAddUserProps extends React.ComponentPropsWithoutRef<"div"> {
  handlerGetUsers: () => void;
  setModal: () => void;
  initialValues?: IAddUserValues;
  viewType: "ADD" | "UPDATE" | "View";
  userId?: number;
  onSuccesAction: () => void;
}

const currentDate = new Date().toISOString().split("T")[0];

const initialState: IAddUserValues = {
  name: "",
  email: "",
  contact: "",
  cnic: "",
  address: "",
  date: currentDate,
  role: "",
  userId: "",
  password: "",
  confirmPassword: "",
};

const optionData = [
  { id: 1, label: "Admin", value: "Admin" },
  { id: 2, label: "User", value: "User" },
];

export const AddUser = ({
  handlerGetUsers,
  setModal,
  initialValues,
  viewType,
  userId,
  onSuccesAction,
}: IAddUserProps) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;
  const [userData, setUserData] = useState<IAddUserValues>(initialState);

  useEffect(() => {
    if (initialValues) {
      setUserData({
        ...initialValues,
        role: initialValues.role?.toLowerCase() === "admin" ? "Admin" : "User",
      });
    }
  }, [initialValues]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "name") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (name === "email") {
      value = value.toLowerCase();
    }

    if (name === "cnic") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 5) {
        value = digits;
      } else if (digits.length <= 12) {
        value = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      } else if (digits.length <= 13) {
        value = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
          12
        )}`;
      } else {
        value = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(
          12,
          13
        )}`;
      }
    }

    setUserData({ ...userData, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (viewType === "ADD") {
      await handleAddUser();
    } else {
      await handleUpdateUser(userId);
    }
  };

  const handleAddUser = async (): Promise<void> => {
    const { name, email, password, confirmPassword, cnic, contact, role } =
      userData;

    if (!name || !email || !password || !confirmPassword || !cnic || !role) {
      toast.error("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 5) {
      toast.error("Password must be at least 5 characters");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      toast.error("Email must end with @gmail.com");
      return;
    }

    if (!/^\d{11}$/.test(contact)) {
      toast.error("Contact must be exactly 11 digits");
      return;
    }

    if (!/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
      toast.error("CNIC must be 13 digits in format 12345-6789012-3");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("contact", contact);
    data.append("cnic", cnic);
    data.append("address", userData.address ?? "");
    data.append("date", userData.date ?? "");
    data.append("role", role);
    data.append("password", password);

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/addUser`, data, {
        headers: { Authorization: token },
      });
      console.log(res.data);
      toast.success("User added successfully");
      setUserData(initialState);
      handlerGetUsers();
      onSuccesAction();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error adding user");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    id: string | number | undefined
  ): Promise<void> => {
    if (!id) return;

    const { name, email, password, confirmPassword, cnic, contact, role } =
      userData;

    if (!name || !email || !cnic || !role) {
      toast.error("Please fill all required fields");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("contact", contact ?? "");
    data.append("cnic", cnic);
    data.append("address", userData.address ?? "");
    data.append("date", userData.date ?? "");
    data.append("role", role);

    if (password) data.append("password", password);

    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/admin/updateUser/${id}`, data, {
        headers: { Authorization: token },
      });
      toast.success("User updated successfully");
      handlerGetUsers();
      onSuccesAction();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating user");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg bg-opacity-90 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[35rem] overflow-y-scroll bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>{viewType} USER</Title>
          <div className="mx-2 flex-wrap gap-3">
            <InputField
              labelName="Name*"
              placeHolder="Enter the Name"
              type="text"
              name="name"
              handlerChange={handlerChange}
              value={userData.name}
            />
            <InputField
              labelName="Email*"
              placeHolder="abc123@gmail.com"
              type="email"
              name="email"
              handlerChange={handlerChange}
              value={userData.email}
            />
            <InputField
              labelName="Phone Number*"
              placeHolder="Enter the Contact Number"
              type="number"
              name="contact"
              handlerChange={handlerChange}
              value={userData.contact}
            />
            <InputField
              labelName="CNIC*"
              placeHolder="12345-6789012-3"
              type="text"
              name="cnic"
              handlerChange={handlerChange}
              value={userData.cnic}
            />
            <InputField
              labelName="Address*"
              placeHolder="Enter the Address"
              type="text"
              name="address"
              handlerChange={handlerChange}
              value={userData.address}
            />
            <InputField
              labelName="Joining Date*"
              placeHolder="Enter the Date"
              type="date"
              name="date"
              handlerChange={handlerChange}
              value={userData.date}
            />
            <InputField
              labelName="Password*"
              placeHolder="Enter the Password"
              type="password"
              name="password"
              handlerChange={handlerChange}
              value={userData.password}
            />
            <InputField
              labelName="Confirm Password*"
              placeHolder="Enter the Confirm Password"
              type="password"
              name="confirmPassword"
              handlerChange={handlerChange}
              value={userData.confirmPassword}
            />
            <OptionField
              value={userData.role}
              labelName="Role*"
              handlerChange={handlerChange}
              name="role"
              optionData={optionData}
              inital="Please Select User"
            />
          </div>
          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={
                loading
                  ? "Loading..."
                  : viewType === "ADD"
                  ? "Add User"
                  : "Update User"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

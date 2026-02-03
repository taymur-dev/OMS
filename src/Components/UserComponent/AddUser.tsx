import { useEffect, useState, ChangeEvent, FormEvent } from "react";
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

const currentDate = new Date().toLocaleDateString("sv-SE", {
  timeZone: "Asia/Karachi",
});

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

  // Image Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialValues) {
      setUserData({
        ...initialValues,
        role: initialValues.role?.toLowerCase() === "admin" ? "Admin" : "User",
      });
    }
  }, [initialValues]);

  const handlerChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "name") {
      value = value.replace(/[^a-zA-Z\s]/g, "").replace(/^\s+/, "");
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }


    if (name === "contact") value = value.replace(/\D/g, "").slice(0, 11);

    if (name === "cnic") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 5) value = digits;
      else if (digits.length <= 12)
        value = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      else
        value = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }

    setUserData({ ...userData, [name]: value });
  };

  const handlerSubmitted = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (viewType === "ADD") {
      await handleAddUser();
    } else {
      await handleUpdateUser(userId);
    }
  };

  const prepareFormData = () => {
    const data = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && key !== "confirmPassword") {
        data.append(key, value.toString());
      }
    });

    if (selectedFile) {
      data.append("image", selectedFile); // Ensure backend looks for "image"
    }
    return data;
  };

  const handleAddUser = async (): Promise<void> => {
    const { name, email, password, confirmPassword, cnic, contact, role } =
      userData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !contact ||
      !cnic ||
      !role
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = prepareFormData();

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/admin/addUser`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User added successfully");
      setUserData(initialState);
      setSelectedFile(null);
      handlerGetUsers();
      onSuccesAction();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error adding user");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (
    id: string | number | undefined,
  ): Promise<void> => {
    if (!id) return;
    const data = prepareFormData();

    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/admin/updateUser/${id}`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("User updated successfully");
      handlerGetUsers();
      onSuccesAction();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating user");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[90vh] overflow-y-auto bg-white mx-auto rounded shadow-xl">
        <form onSubmit={handlerSubmitted}>
          {/* ===== Header ===== */}
          <div className=" bg-indigo-900 rounded px-4">
            <div className="text-white">
              <Title setModal={setModal}>{viewType} USER</Title>
            </div>
          </div>

          {/* ===== Body ===== */}
          <div className="mx-4 my-4 grid grid-cols-1 sm:grid-cols-2 width-full gap-4">
            {/* Image Upload Section */}

            <InputField
              labelName="Name *"
              type="text"
              name="name"
              handlerChange={handlerChange}
              value={userData.name}
            />
            <InputField
              labelName="Email *"
              type="email"
              name="email"
              handlerChange={handlerChange}
              value={userData.email}
            />
            <InputField
              labelName="Phone Number *"
              type="number"
              name="contact"
              handlerChange={handlerChange}
              value={userData.contact}
            />
            <InputField
              labelName="CNIC *"
              type="text"
              name="cnic"
              handlerChange={handlerChange}
              value={userData.cnic}
            />
            <InputField
              labelName="Address *"
              type="text"
              name="address"
              handlerChange={handlerChange}
              value={userData.address}
            />
            <InputField
              labelName="Joining Date *"
              type="date"
              name="date"
              handlerChange={handlerChange}
              value={userData.date}
            />

            <InputField
              labelName="Password *"
              type="password"
              name="password"
              handlerChange={handlerChange}
              value={userData.password}
            />
            <InputField
              labelName="Confirm Password *"
              type="password"
              name="confirmPassword"
              handlerChange={handlerChange}
              value={userData.confirmPassword}
            />

            <div className="sm:col-span-2">
              <OptionField
                value={userData.role}
                labelName="Role *"
                handlerChange={handlerChange}
                name="role"
                optionData={optionData}
                inital="Please Select User"
              />
            </div>
          </div>

          {/* ===== Footer ===== */}
          <div className="bg-indigo-900 rounded py-3 flex justify-end gap-3 px-4 sticky bottom-0">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={
                loading ? "Loading..." : viewType === "ADD" ? "Save" : "Update"
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

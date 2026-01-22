import { BiUser } from "react-icons/bi";
import { FaProjectDiagram } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { GiTakeMyMoney } from "react-icons/gi";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import axios from "axios";
import { BASE_URL } from "../Content/URL";
import { OptionField } from "./InputFields/OptionField";
import { InputField } from "./InputFields/InputField";
import { Columns } from "./MenuCards/Colums";
import Card from "./DetailCards/Card";

type CategoryT = { id: number; categoryName: string };
type UserT = {
  id: number;
  name?: string;
  email?: string;
  loginStatus: "Y" | "N";
};
type TodoT = { id: number; todoStatus: "Y" | "N" };
type completionStatus = "New" | "Working" | "Complete";

type AssignProjectAPIResponse = {
  projectId: number;
  projectName: string;
  completionStatus: completionStatus;
  projectCategory: string;
};

type ProjectT = {
  id: string;
  projectName: string;
  completionStatus: string;
  projectCategory: string;
};

const columsData = [
  { id: "New", title: "New Project" },
  { id: "Working", title: "Working Project" },
  { id: "Complete", title: "Complete Project" },
];

export const MainContent = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [allCategory, setAllCategory] = useState<CategoryT[] | null>(null);
  const [allAssignProjects, setAllAssignProjects] = useState<ProjectT[]>([]);
  const [allTodos, setAllTodos] = useState<TodoT[]>([]);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState([]);

  const currentDate = new Date().toLocaleDateString("sv-SE");

  const [formData, setFormData] = useState({
    categoryName: "",
    fromDate: currentDate,
    toDate: currentDate,
  });

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetAssignProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedProjects: ProjectT[] = res.data.map(
        (p: AssignProjectAPIResponse) => ({
          id: String(p.projectId),
          projectName: p.projectName,
          completionStatus: p.completionStatus,
          projectCategory: p.projectCategory,
        }),
      );

      setAllAssignProjects(formattedProjects);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlegetTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTodos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetExpenseCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenseCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetTotalExpense = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTotalExpense`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalExpenseAmount(Number(res.data.totalExpense));
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetProjectsCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.title = "(OMS) Admin Dashboard";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("logIn")), 1000);
  }, [dispatch]);

  useEffect(() => {
    getAllUsers();
    handleGetAssignProjects();
    handlegetTodos();
    handleGetTotalExpense();
    handleGetExpenseCategory();
    handleGetProjectsCategory();
  }, [
    getAllUsers,
    handleGetAssignProjects,
    handlegetTodos,
    handleGetTotalExpense,
    handleGetExpenseCategory,
    handleGetProjectsCategory,
  ]);

  const activeUsers = allUsers.filter((user) => user.loginStatus === "Y");
  const activeTodos = allTodos.filter((todo) => todo.todoStatus === "Y");

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 space-y-5 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card
          titleName="Users"
          totalUser="Total Users"
          totalNumber={activeUsers.length}
          icon={<BiUser className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

        <Card
          titleName="Assigned Projects"
          totalUser="Total Projects"
          totalNumber={allAssignProjects.length}
          icon={<FaProjectDiagram className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

        <Card
          titleName="Todo's"
          totalUser="Active Todo's"
          totalNumber={activeTodos.length}
          icon={<LuListTodo className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

        <Card
          titleName="Expense Categories"
          totalUser="Total Categories"
          totalNumber={expenseCategory.length}
          icon={<CiViewList className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

        <Card
          titleName="Total Expense"
          totalNumber={totalExpenseAmount}
          isCurrency
          icon={<GiTakeMyMoney className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

         <Card
          titleName="Sales"
          totalNumber={totalExpenseAmount}
          isCurrency
          icon={<GiTakeMyMoney className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

         <Card
          titleName="Total Customers"
          totalNumber={totalExpenseAmount}
          isCurrency
          icon={<GiTakeMyMoney className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />

         <Card
          titleName="Assets"
          totalNumber={totalExpenseAmount}
          isCurrency
          icon={<GiTakeMyMoney className="text-2xl" />}
          style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
        />
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full">
        <div className="w-full min-w-0">
          <OptionField
            labelName="Category"
            name="categoryName"
            handlerChange={handleChange}
            value={formData.categoryName}
            optionData={allCategory?.map((category) => ({
              id: category.id,
              label: category.categoryName,
              value: category.categoryName,
            }))}
            inital="Select Category"
          />
        </div>

        <div className="w-full min-w-0">
          <InputField
            type="date"
            labelName="From Date"
            name="fromDate"
            value={formData.fromDate}
            handlerChange={handleChange}
          />
        </div>

        <div className="w-full min-w-0">
          <InputField
            type="date"
            labelName="To Date"
            name="toDate"
            value={formData.toDate}
            handlerChange={handleChange}
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-6">
        {columsData.map((column) => (
          <div key={column.id} className="min-h-[400px]">
            <Columns
              colum={column}
              allProject={allAssignProjects.filter(
                (project) =>
                  project.completionStatus === column.id &&
                  (!formData.categoryName ||
                    project.projectCategory === formData.categoryName),
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

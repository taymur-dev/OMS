import { BiUser } from "react-icons/bi";
import { FaProjectDiagram } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { GiTakeMyMoney } from "react-icons/gi";
import { CiViewList } from "react-icons/ci";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loader } from "./LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../Content/URL";
import { OptionField } from "./InputFields/OptionField";
import { Columns } from "./MenuCards/Colums";
import Card from "./DetailCards/Card";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

type CategoryT = { id: number; categoryName: string };
type DummyDataT = { id: string; projectName: string; status: string };

const columsData = [
  { id: "newProject", title: "New Project" },
  { id: "working", title: "Working Project" },
  { id: "complete", title: "Complete Project" },
];

const dummyProjects: DummyDataT[] = [
  { id: "1", projectName: "Website Redesign", status: "newProject" },
  { id: "2", projectName: "Marketing Strategy", status: "working" },
  { id: "3", projectName: "Mobile App Launch", status: "complete" },
  { id: "4", projectName: "CRM Integration", status: "working" },
  { id: "5", projectName: "SEO Optimization", status: "newProject" },
  { id: "6", projectName: "Cloud Migration", status: "complete" },
  { id: "7", projectName: "Brand Identity Update", status: "working" },
  { id: "8", projectName: "Internal Tooling", status: "newProject" },
  { id: "9", projectName: "Sales Automation", status: "complete" },
  { id: "10", projectName: "Customer Feedback System", status: "newProject" },
];

export const MainContent = () => {
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState([]);
  const [allCategory, setAllCategory] = useState<CategoryT[] | null>(null);
  const [formData, setFormData] = useState({ categoryName: "" });
  const [allAssignProjects, setAllAssignProjects] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [dummyData, setDummyData] = useState<DummyDataT[]>(dummyProjects);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlegetAssignProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAssignProjects`, {
        headers: { Authorization: token },
      });
      setAllAssignProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlegetTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTodos`, {
        headers: { Authorization: token },
      });
      setAllTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getExpense`, {
        headers: { Authorization: token },
      });
      setAllExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetExpenseCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getExpenseCategory`, {
        headers: { Authorization: token },
      });
      setExpenseCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetProjectsCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: token },
      });
      setAllCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const newStatus = over.id as DummyDataT["status"];
    setDummyData((prevData) =>
      prevData.map((project) =>
        project.id === taskId ? { ...project, status: newStatus } : project
      )
    );
  };

  useEffect(() => {
    document.title = "(OMS) Admin Dashboard";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("logIn")), 1000);
  }, [dispatch]);

  useEffect(() => {
    getAllUsers();
    handlegetAssignProjects();
    handlegetTodos();
    handleGetExpenses();
    handleGetExpenseCategory();
    handleGetProjectsCategory();
  }, [
    getAllUsers,
    handlegetAssignProjects,
    handlegetTodos,
    handleGetExpenses,
    handleGetExpenseCategory,
    handleGetProjectsCategory,
  ]);

  if (loader)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <Loader />
      </div>
    );

  return (
    <div className="w-full h-full overflow-y-hidden p-1 space-y-6">
      {/* Filter */}
      <form className="flex-1 flex-col sm:flex-row gap-4">
        <div className="ml-232  w-108  pt-1 pb-2  pr-2 pl-2">
          <OptionField
            labelName=""
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
      </form>

      {/* Kanban Columns */}
      <div className="flex flex-col lg:flex-row gap-0 ml-6">
        <DndContext onDragEnd={handleDragEnd}>
          {columsData.map((column) => (
            <Columns
              key={column.id}
              colum={column}
              allProject={dummyData.filter((task) => task.status === column.id)}
            />
          ))}
        </DndContext>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          titleName="Users"
          totalUser="Total Users"
          totalNumber={allUsers.length}
          icon={<BiUser className="text-3xl" />}
          style="bg-gradient-to-r from-purple-500 to-indigo-700 text-white ml-[1.2cm]"
        />

        <Card
          titleName="Assigned Projects"
          totalUser="Total Projects"
          totalNumber={allAssignProjects.length}
          icon={<FaProjectDiagram className="text-3xl" />}
          style="bg-gradient-to-r from-green-500 to-blue-700 text-white"
        />

        <Card
          titleName="Todo's"
          totalUser="Total Todo's"
          totalNumber={allTodos.length}
          icon={<LuListTodo className="text-3xl" />}
          style="bg-gradient-to-r from-yellow-400 to-orange-600 text-white"
        />

        <Card
          titleName="Expense Categories"
          totalUser="Total Categories"
          totalNumber={expenseCategory.length}
          icon={<CiViewList className="text-3xl" />}
          style="bg-gradient-to-r from-fuchsia-500 to-fuchsia-700 text-white"
        />

        <Card
          titleName="Total Expense"
          totalUser="Total Expense Items"
          totalNumber={allExpenses.length}
          icon={<GiTakeMyMoney className="text-3xl" />}
          style="bg-gradient-to-r from-cyan-600 to-cyan-800 text-white mr-[1.6cm]"
        />
      </div>
    </div>
  );
};

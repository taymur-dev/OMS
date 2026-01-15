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
import { Columns } from "./MenuCards/Colums";
import Card from "./DetailCards/Card";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

type CategoryT = { id: number; categoryName: string };
type UserT = {
  id: number;
  name?: string;
  email?: string;
  loginStatus: "Y" | "N";
};
type TodoT = { id: number; todoStatus: "Y" | "N" };

type ProjectStatus = "New" | "Working" | "Complete";

type AssignProjectAPIResponse = {
  projectId: number;
  projectName: string;
  status: ProjectStatus;
  projectCategory: string;
};

type ProjectT = {
  id: string;
  projectName: string;
  status: ProjectStatus;
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
  const [formData, setFormData] = useState({ categoryName: "" });
  const [allAssignProjects, setAllAssignProjects] = useState<ProjectT[]>([]);
  const [allTodos, setAllTodos] = useState<TodoT[]>([]);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState([]);

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

  const handleGetAssignProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAssignProjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedProjects: ProjectT[] = res.data.map(
        (p: AssignProjectAPIResponse) => ({
          id: String(p.projectId),
          projectName: p.projectName,
          status: p.status,
          projectCategory: p.projectCategory,
        })
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
        headers: { Authorization: token },
      });
      setExpenseCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetTotalExpense = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTotalExpense`, {
        headers: { Authorization: token },
      });
      setTotalExpenseAmount(Number(res.data.totalExpense));
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const projectId = active.id;
    const newStatus = over.id as ProjectStatus;

    setAllAssignProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p } : p))
    );

    try {
      await axios.put(
        `${BASE_URL}/api/admin/updateProjectStatus/${projectId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error(error);
      handleGetAssignProjects();
    }
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
    <div className="w-full h-full overflow-y-hidden p-1 space-y-6">
      <form className="flex-1 flex-col sm:flex-row gap-4">
        <div className="ml-236 w-109">
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

      <div className="flex flex-col lg:flex-row gap-0 ml-6">
        <DndContext onDragEnd={handleDragEnd}>
          {columsData.map((column) => (
            <Columns
              key={column.id}
              colum={column}
              allProject={
                column.id === "New"
                  ? // Only filter by category for New Project column
                    allAssignProjects.filter(
                      (project) =>
                        !formData.categoryName ||
                        project.projectCategory === formData.categoryName
                    )
                  : // For Working and Complete, show all projects (status-based filtering can go here later)
                    allAssignProjects
              }
            />
          ))}
        </DndContext>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-1 px-6.5">
        <Card
          titleName="Users"
          totalUser="Total Users"
          totalNumber={activeUsers.length}
          icon={<BiUser className="text-3xl" />}
          style="bg-white"
        />

        <Card
          titleName="Assigned Projects"
          totalUser="Total Projects"
          totalNumber={allAssignProjects.length}
          icon={<FaProjectDiagram className="text-3xl" />}
          style="bg-white"
        />

        <Card
          titleName="Todo's"
          totalUser="Active Todo's"
          totalNumber={activeTodos.length}
          icon={<LuListTodo className="text-3xl" />}
          style="bg-white"
        />

        <Card
          titleName="Expense Categories"
          totalUser="Total Categories"
          totalNumber={expenseCategory.length}
          icon={<CiViewList className="text-3xl" />}
          style="bg-white"
        />

        <Card
          titleName="Total Expense"
          totalNumber={totalExpenseAmount}
          isCurrency
          icon={<GiTakeMyMoney className="text-3xl" />}
          style="bg-white"
        />
      </div>
    </div>
  );
};

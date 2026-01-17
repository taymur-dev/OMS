import { FaTasks } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";

interface TodoItem {
  taskName: string;
  deadline: string;
}

const TodoCard = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!token || !userId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/user/getTodo/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming API returns an array of todos with taskName and deadline
        setTodos(res.data.todos || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [token, userId]);

  return (
    <div className="max-w-lg bg-white shadow-lg rounded-lg mt-16 w-full max-h-screen">
      {/* Header */}
      <div className="bg-indigo-900 text-white text-lg font-semibold p-4">
        Todo's
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2 text-gray-700 font-serif">
            <FaTasks className="text-indigo-900" />
            Tasks
          </div>
          <div className="flex items-center gap-2 text-gray-700 font-serif">
            <BsCalendarDate className="text-indigo-900" />
            Deadline
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No todos available</div>
        ) : (
          todos.map((todo, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b last:border-b-0 text-sm text-gray-700"
            >
              <span>{todo.taskName}</span>
              <span>{todo.deadline}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <Link
          to="/users/todo"
          className="text-indigo-900 hover:underline font-medium"
        >
          For More
        </Link>
      </div>
    </div>
  );
};

export default TodoCard;

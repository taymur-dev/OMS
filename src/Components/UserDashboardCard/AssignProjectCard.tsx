import { FaTasks } from "react-icons/fa";
import { BsCalendarDate } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";
import { Loader } from "../LoaderComponent/Loader";
import { Link } from "react-router-dom";

interface Project {
  id: string | number;
  name: string;
  assignedDate: string;
}

const TodoCard = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token || !userId) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/user/getMyAssignProjects/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming API returns an array of projects with { id, name, assignedDate }
        setProjects(res.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, userId]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-lg mx-8 bg-white shadow-lg rounded-lg mt-16 w-full max-h-screen">
      {/* Header */}
      <div className="bg-indigo-500 text-white text-lg font-semibold p-4">
        Projects
      </div>

      {/* Content */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center border-b pb-3 text-gray-700 font-semibold">
          <div className="flex items-center gap-2">
            <FaTasks className="text-indigo-500" />
            Project Name
          </div>
          <div className="flex items-center gap-2">
            <BsCalendarDate className="text-indigo-500" />
            Assigned Date
          </div>
        </div>

        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="px-4 py-2 flex justify-between text-sm text-gray-700 border-b last:border-b-0"
            >
              <span>{project.name}</span>
              <span>{new Date(project.assignedDate).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">No projects assigned</div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 text-center">
        <Link to="/users/projects" className="text-blue-500 hover:underline font-medium">
          For More
        </Link>
      </div>
    </div>
  );
};

export default TodoCard;

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { Title } from "../Title";
import { FaUser, FaProjectDiagram } from "react-icons/fa";

type ViewAssignProjectProps = {
  setIsOpenModal: () => void;
  user: { id: number; name: string } | null; // Ab hum user pass kar rahe hain
};

export type ALLASSIGNPROJECTT = {
  id: number;
  employee_id: number;
  name: string;
  projectName: string;
  projectId: number;
  date: string;
};

export const ViewAssignProject = ({ setIsOpenModal, user }: ViewAssignProjectProps) => {
  const [userProjects, setUserProjects] = useState<ALLASSIGNPROJECTT[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAppSelector((state) => state.officeState);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getUserProjects/${user.id}`, {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        setUserProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProjects();
  }, [user, currentUser]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[32rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title setModal={setIsOpenModal}>USER ASSIGNMENTS</Title>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FaUser size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-500">Employee ID: #{user.id}</p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <FaProjectDiagram /> ASSIGNED PROJECTS
          </h3>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">Sr#</th>
                  <th className="px-4 py-3">Project Name</th>
                  <th className="px-4 py-3">Assigned Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                ) : userProjects.length > 0 ? (
                  userProjects.map((proj, idx) => (
                    <tr key={proj.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-blue-600">{proj.projectName}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(proj.date).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="text-center py-4 text-gray-400">No projects assigned yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end">
          <button onClick={setIsOpenModal} className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
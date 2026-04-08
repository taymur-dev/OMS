import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";
import {
  Mail,
  CreditCard,
  Phone,
  ShieldCheck,
  User,
  LucideIcon,
} from "lucide-react";
import AvatarPlaceholder from "../../assets/vector.png";
import { Footer } from "../../Components/Footer";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export const SystemUserProfile = () => {
  // Using the currentUser from redux as the primary data source
  const { currentUser } = useAppSelector((state) => state.officeState);

  // Helper to handle image paths similar to your SystemUsers logic
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return AvatarPlaceholder;
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/${imagePath}`;
  };

  const DetailRow = ({ icon: Icon, label, value }: DetailRowProps) => (
    <div
      className="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between border-b
      border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 rounded-xl"
    >
      <div className="flex items-center gap-3 mb-1 sm:mb-0">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-gray-900 font-semibold sm:text-right break-words max-w-md ml-11 sm:ml-0">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8f9fa]">
      <div className="flex-grow w-full px-4 py-6 sm:px-6 lg:px-8">
        <TableTitle tileName="System User Profile" />
        <hr className="border-b border-gray-200 mb-8" />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
            {/* Banner Section */}
            <div
              className="h-40 bg-blue-500 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))]
              from-blue-600 via-blue-700 to-indigo-900 relative"
            ></div>

            <div className="px-8 pb-10">
              {/* Profile Header */}
              <div className="relative flex flex-col items-center sm:items-end sm:flex-row gap-6 -mt-20 mb-8">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-2xl bg-white overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={getImageUrl(currentUser?.image)}
                      alt="Profile"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = AvatarPlaceholder;
                      }}
                    />
                  </div>
                  <span className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></span>
                </div>

                <div className="flex-1 text-center sm:text-left mb-2">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {currentUser?.name || "System User"}
                  </h2>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      {currentUser?.role || "User"}
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-8">
                <section>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 px-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Account Information
                  </h3>
                  <div className="bg-gray-50/50 rounded-2xl p-2 border border-gray-100">
                    <DetailRow
                      icon={Mail}
                      label="Primary Email"
                      value={currentUser?.email ?? "Not provided"}
                    />
                    <DetailRow
                      icon={CreditCard}
                      label="Identity (CNIC)"
                      value={currentUser?.cnic ?? "00000-0000000-0"}
                    />
                    <DetailRow
                      icon={Phone}
                      label="Contact Number"
                      value={currentUser?.contact ?? "Not provided"}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

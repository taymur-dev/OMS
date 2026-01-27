import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useAppSelector } from "../../redux/Hooks";
import {
  Mail,
  CreditCard,
  Phone,
  ShieldCheck,
  LucideIcon,
  User,
} from "lucide-react";
// 1. Import your local asset
import DefaultAvatar from "../../assets/Avatar.png";
import { Footer } from "../../Components/Footer"; // Import Footer

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export const Profile = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const DetailRow = ({ icon: Icon, label, value }: DetailRowProps) => (
    <div className="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between border-b
     border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
      <div className="flex items-center gap-3 mb-1 sm:mb-0">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-4 h-4 text-indigo-600" />
        </div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-gray-900 font-semibold sm:text-right break-all ml-11 sm:ml-0">
        {value}
      </p>
    </div>
  );

  return (
    /* flex flex-col min-h-screen ensures the content pushes the footer down */
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="flex-grow w-full px-4 py-6 sm:px-6 lg:px-8">
        <TableTitle tileName="User Profile" />
        <hr className="border border-b border-gray-200" />

        <div className="max-w-3xl mx-auto mt-10">
          <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
            <div
              className="h-32 bg-indigo-900 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))]
              from-indigo-800 via-indigo-900 to-slate-900"
            />

            <div className="px-8 pb-10">
              <div className="relative flex flex-col items-center sm:items-end sm:flex-row gap-6 -mt-16 mb-10">
                <div className="relative group">
                  <div
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-white
                   shadow-2xl
      bg-indigo-900  flex items-center justify-center overflow-hidden"
                  >
                    {currentUser?.profileImage ? (
                      <img
                        className="w-full h-full object-cover"
                        src={currentUser.profileImage}
                        alt="Profile"
                      />
                    ) : DefaultAvatar ? (
                      <img
                        className="w-full h-full object-cover"
                        src={DefaultAvatar}
                        alt="Default Avatar"
                      />
                    ) : (
                      <span className="text-white text-4xl sm:text-5xl font-bold tracking-tighter">
                        {currentUser?.name ? (
                          getInitials(currentUser.name)
                        ) : (
                          <User size={48} />
                        )}
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm"></span>
                </div>

                <div className="flex-1 text-center sm:text-left mb-2">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {currentUser?.name ?? "Guest User"}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 mt-2 bg-indigo-50 text-indigo-700
                   rounded-full text-sm font-bold">
                    <    ShieldCheck className="w-4 h-4" />
                    {currentUser?.role ?? "Standard User"}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">
                  Account Details
                </h3>
                <div className="bg-gray-50/50 rounded-2xl p-2">
                  <DetailRow
                    icon={Mail}
                    label="Email Address"
                    value={currentUser?.email ?? "Not provided"}
                  />
                  <DetailRow
                    icon={CreditCard}
                    label="CNIC Number"
                    value={currentUser?.cnic ?? "00000-0000000-0"}
                  />
                  <DetailRow
                    icon={Phone}
                    label="Contact"
                    value={currentUser?.contact ?? "None"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER SECTION --- */}
      <div className="mt-auto border-t border-gray-200 bg-white">
        <Footer />
      </div>
    </div>
  );
};
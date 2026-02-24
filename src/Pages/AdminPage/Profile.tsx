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
import DefaultAvatar from "../../assets/Avatar.png";
import { Footer } from "../../Components/Footer";

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
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="p-3 bg-indigo-50 rounded-xl">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-gray-800 font-semibold mt-1 break-all">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-200 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-grow w-full px-4 py-3 sm:px-6 lg:px-8">
        <TableTitle tileName="Profile" />
        <hr className="border-gray-200 mt-2" />

        <div className="max-w-4xl mx-auto mt-5">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

            {/* Header Background */}
            <div className="h-30 bg-indigo-900 relative">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
            </div>

            <div className="px-8 pb-10">
              {/* Avatar + Name Section */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 mb-10">

                <div className="relative group">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white shadow-2xl bg-indigo-900 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
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
                      <span className="text-white text-5xl font-bold">
                        {currentUser?.name
                          ? getInitials(currentUser.name)
                          : <User size={50} />}
                      </span>
                    )}
                  </div>

                  {/* Online Indicator */}
                  <span className="absolute bottom-3 right-3 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-md"></span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                    {currentUser?.name ?? "Guest User"}
                  </h2>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 mt-3 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    {currentUser?.role ?? "Standard User"}
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wide">
                  Account Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    label="Contact Number"
                    value={currentUser?.contact ?? "None"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-200 bg-white">
        <Footer />
      </div>
    </div>
  );
};
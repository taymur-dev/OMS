import { MainContent } from "../Components/MainContent";
import { Footer } from "../Components/Footer";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <MainContent />
      </div>
      <Footer />
    </div>
  );
};

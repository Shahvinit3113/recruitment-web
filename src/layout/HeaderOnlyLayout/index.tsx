import Header from "../../components/layout/Header";
import { Outlet } from "react-router-dom";

const HeaderOnlyLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isSidebarOpen={false} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default HeaderOnlyLayout;

import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please sign in to continue
          </p>
        </div>

        {/* Render nested routes here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

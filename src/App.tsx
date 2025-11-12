import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/authentication/login";
import {
  AuthLayout,
  ErrorLayout,
  HeaderOnlyLayout,
  MainLayout,
} from "./layout";
import {
  Forbidden,
  NetworkError,
  NotFound,
  ServerError,
} from "./layout/ErrorLayout";
import ProtectedRoute from "./layout/ProtectedRoute";
import Organization from "./pages/organization";
import Settings from "./pages/settings";
import Task from "./pages/task";
import Position from "./pages/position";
import Department from "./pages/department";
import Template from "./pages/templates";

function App() {
  return (
    <>
      <Routes>
        {/* Dashboard/Admin pages */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organization" element={<Organization />} />
            <Route path="/templates" element={<Template />} />
            <Route path="/task" element={<Task />} />
            <Route path="/position" element={<Position />} />
            <Route path="/department" element={<Department />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Layout with Authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Layout with Header Only */}
        <Route element={<HeaderOnlyLayout />}>
          <Route path="/loginheader" element={<Login />} />
        </Route>

        {/* Error Pages */}
        <Route element={<ErrorLayout />}>
          <Route path="/500" element={<ServerError />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/network-error" element={<NetworkError />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {/* <ReactQueryDevtools
        initialIsOpen={false}
        position={"bottom-right" as any}
      /> */}
    </>
  );
  {
    /* </QueryClientProvider> */
  }
}

export default App;

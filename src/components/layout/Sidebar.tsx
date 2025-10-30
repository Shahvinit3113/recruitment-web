import {
  BarChart3,
  Building,
  FileText,
  Home,
  Settings,
  ListCollapse,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
    {
      id: "organization",
      label: "Organization",
      icon: Building,
      href: "/organization",
    },
    {
      id: "task",
      label: "Task",
      icon: ListCollapse,
      href: "/task",
    },
    { id: "candidates", label: "Candidates", icon: Users, href: "/candidates" },
    { id: "jobs", label: "Jobs", icon: FileText, href: "/jobs" },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    navigate(path);
    onClose?.(); // close sidebar on mobile
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.href;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Need help?</div>
            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
              Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

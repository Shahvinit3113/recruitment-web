import {
  Building,
  Home,
  Settings,
  ListCollapse,
  Briefcase,
  Network,
  CircleUserRound,
  ChevronDown,
  ChevronRight,
  LayoutTemplate,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  href?: string;
  children?: MenuItem[];
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // 🧭 Update active item and expand parent if nested route active
  useEffect(() => {
    setActiveItem(location.pathname);

    menuItems.forEach((item) => {
      if (
        item.children?.some((child) =>
          location.pathname.startsWith(child.href!)
        )
      ) {
        setOpenMenus((prev) => [...new Set([...prev, item.id])]);
      }
    });
  }, [location.pathname]);

  const handleNavigation = (path?: string) => {
    if (!path) return;
    navigate(path);
    onClose?.();
  };

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  // 🧩 Menu configuration
  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
    // {
    //   id: "applications",
    //   label: "Applications",
    //   icon: CircleUserRound,
    //   children: [
    //     {
    //       id: "application",
    //       label: "List",
    //       href: "/application",
    //     },
    //     {
    //       id: "application-templates",
    //       label: "Templates",
    //       href: "/application/templates",
    //     },
    //   ],
    // },
    {
      id: "organization",
      label: "Organization",
      icon: Building,
      href: "/organization",
    },
    {
      id: "templates",
      label: "Template",
      icon: LayoutTemplate,
      href: "/templates",
    },
    { id: "position", label: "Position", icon: Briefcase, href: "/position" },
    {
      id: "department",
      label: "Department",
      icon: Network,
      href: "/department",
    },
    { id: "task", label: "Task", icon: ListCollapse, href: "/task" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  const renderMenu = (items: MenuItem[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = activeItem === item.href;
      const isOpen = openMenus.includes(item.id);
      const isChildActive = item.children?.some(
        (child) => activeItem === child.href
      );

      return (
        <div key={item.id}>
          {/* 🔹 Parent Menu Button */}
          <button
            onClick={() =>
              item.children ? toggleMenu(item.id) : handleNavigation(item.href)
            }
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer
          ${
            isActive
              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          } 
          ${
            item.children && isChildActive
              ? "text-blue-700" // 🔹 only change text color if child active, no background
              : ""
          }`}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon size={18} />}
              {item.label}
            </div>
            {item.children &&
              (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>

          {/* 🔽 Nested Items */}
          {item.children && isOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleNavigation(child.href)}
                  className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer
                ${
                  activeItem === child.href
                    ? "text-blue-700 bg-blue-50 font-medium border-r-2 border-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    });
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
            <nav className="space-y-2">{renderMenu(menuItems)}</nav>
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

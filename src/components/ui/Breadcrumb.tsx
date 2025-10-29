import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      className="flex items-center space-x-2 text-sm mb-6"
      aria-label="Breadcrumb"
    >
      <a
        href="/"
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </a>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />

          {item.active || !item.href ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <a
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item.label}
            </a>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

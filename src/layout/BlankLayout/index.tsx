import type { ReactNode } from "react";

interface BlankLayoutProps {
  children: ReactNode;
}

const BlankLayout = ({ children }: BlankLayoutProps) => {
  return <div className="min-h-screen">{children}</div>;
};

export default BlankLayout;

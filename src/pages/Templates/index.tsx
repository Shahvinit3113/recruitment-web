import React from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";

const Template = () => {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Template", active: true },
        ]}
      />
    </>
  );
};

export default Template;

import Breadcrumb from "@/components/ui/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { setComponentSize } from "@/Redux/Slices/settingsSlice";
import type { ComponentSize } from "@/Redux/Slices/settingsSlice";
import type { RootState, AppDispatch } from "@/Redux/Store";

const index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  const handleSizeChange = (size: ComponentSize) => {
    dispatch(setComponentSize(size));
  };

  const sizes: { value: ComponentSize; label: string }[] = [
    { value: "xs", label: "Extra Small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Settings", active: true },
        ]}
      />

      <div className="mt-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Component Size</h2>
          <p className="text-gray-600 mb-4">
            Select the default size for buttons and input fields across the
            application.
          </p>

          <div className="flex flex-wrap gap-3">
            {sizes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleSizeChange(value)}
                className={`px-4 py-2 rounded border transition-colors ${
                  currentSize === value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Current size:{" "}
            <span className="font-semibold">{currentSize.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

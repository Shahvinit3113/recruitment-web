import React, { useMemo, memo, useCallback, useState, useEffect } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

interface CommonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  hoverable?: boolean;
  striped?: boolean;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

// Sort Icon Component
const SortIcon = memo<{ direction: SortDirection }>(({ direction }) => {
  if (!direction) {
    return (
      <svg
        className="w-4 h-4 ml-1 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }

  return direction === "asc" ? (
    <svg
      className="w-4 h-4 ml-1 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 ml-1 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
});

SortIcon.displayName = "SortIcon";

// Loading Skeleton
const LoadingSkeleton = memo(() => (
  <tr>
    <td colSpan={100} className="px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </td>
  </tr>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

// Empty State
const EmptyState = memo<{ message: string; colSpan: number }>(
  ({ message, colSpan }) => (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium">{message}</p>
        </div>
      </td>
    </tr>
  )
);

EmptyState.displayName = "EmptyState";

function BaseTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  hoverable = true,
  striped = false,
  className = "",
  emptyMessage = "No data available",
  loading = false,
}: CommonTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSort = useCallback(
    (columnKey: string) => {
      setSortColumn((prev) => {
        const isSameColumn = prev === columnKey;
        return isSameColumn ? prev : columnKey;
      });

      setSortDirection((current) => {
        const isSameColumn = sortColumn === columnKey;
        if (!isSameColumn) return "asc";
        if (current === "asc") return "desc";
        if (current === "desc") {
          setSortColumn(null);
          return null;
        }
        return "asc";
      });
    },
    [sortColumn]
  );

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const getAlignmentClass = useCallback(
    (align?: "left" | "center" | "right") => {
      switch (align) {
        case "center":
          return "text-center";
        case "right":
          return "text-right";
        default:
          return "text-left";
      }
    },
    []
  );

  const getFlexAlignment = useCallback(
    (align?: "left" | "center" | "right") => {
      switch (align) {
        case "center":
          return "justify-center";
        case "right":
          return "justify-end";
        default:
          return "justify-start";
      }
    },
    []
  );

  const renderCell = useCallback((column: Column<T>, row: T, index: number) => {
    if (column.render) {
      return column.render(row[column.key], row, index);
    }
    const value = row[column.key];
    return value !== null && value !== undefined ? String(value) : "—";
  }, []);

  // Mobile Card View
  const renderMobileView = () => (
    <div className="md:hidden space-y-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      ) : sortedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-2">
          <svg
            className="w-16 h-16 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg font-medium text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        sortedData.map((row, index) => (
          <div
            key={keyExtractor(row, index)}
            onClick={() => onRowClick?.(row, index)}
            className={`bg-white border border-gray-200 rounded-lg p-4 space-y-3 ${
              onRowClick ? "cursor-pointer active:bg-gray-50" : ""
            }`}
          >
            {columns.map((column) => (
              <div key={column.key} className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  {column.label}
                </span>
                <div className="text-sm text-gray-900">
                  {renderCell(column, row, index)}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile View */}
      {renderMobileView()}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg ">
        <table className="w-full bg-white text-sm">
          <thead className="bg-gray-200 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 font-semibold text-gray-700 ${
                    column.className || ""
                  }`}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className={`flex items-center hover:text-gray-900 transition-colors w-full ${getFlexAlignment(
                        column.align
                      )}`}
                    >
                      <span>{column.label}</span>
                      <SortIcon
                        direction={
                          sortColumn === column.key ? sortDirection : null
                        }
                      />
                    </button>
                  ) : (
                    <div className={getAlignmentClass(column.align)}>
                      {column.label}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <LoadingSkeleton />
            ) : sortedData.length === 0 ? (
              <EmptyState message={emptyMessage} colSpan={columns.length} />
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  onClick={() => onRowClick?.(row, index)}
                  className={`${
                    hoverable
                      ? "hover:bg-gray-50 transition-colors duration-150"
                      : ""
                  } ${striped && index % 2 === 1 ? "bg-gray-25" : ""} ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={`${keyExtractor(row, index)}-${column.key}`}
                      className={`px-6 py-4 ${getAlignmentClass(
                        column.align
                      )} ${column.className || ""}`}
                    >
                      {renderCell(column, row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(BaseTable) as typeof BaseTable;

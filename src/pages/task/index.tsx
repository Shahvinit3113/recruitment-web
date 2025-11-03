import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/Store";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BaseTable from "@/baseComponent/BaseTable";
import type { Column } from "@/baseComponent/BaseTable";
import BaseButton from "@/baseComponent/BaseButton";
import BaseModal from "@/baseComponent/BaseModal";
import BaseInput from "@/baseComponent/BaseInput";
import {
  fetchAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/Redux/Slices/Task/task";
import type { TaskItem } from "@/api/types/task";
import { formatDate } from "@/utils/formatDate";
import BaseSelect from "@/baseComponent/BaseSelect";

const Task: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.task
  );
  const componentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  // ✅ Username options
  const userNameOptions = [
    { value: "vinit", label: "Vinit" },
    { value: "yash", label: "Yash" },
  ];

  // ✅ Status options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
    { value: "closed", label: "Closed" },
  ];

  // ✅ Status color mapping
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      "on-hold": "bg-orange-100 text-orange-800 border-orange-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // ✅ State for modal & form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTaskUid, setSelectedTaskUid] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [selectedDescription, setSelectedDescription] =
    useState<TaskItem | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(
    null
  );
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    stack: "",
    startDate: "",
    endDate: "",
    status: "active",
    description: "",
  });

  // ✅ Fetch tasks on mount
  useEffect(() => {
    dispatch(fetchAllTasks({ PageSize: 10, PageIndex: 1, SortBy: null }));
  }, [dispatch]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setStatusDropdownOpen(null);
    if (statusDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [statusDropdownOpen]);

  // ✅ Handle status change
  const handleStatusChange = async (
    taskUid: string,
    task: TaskItem,
    newStatus: string
  ) => {
    setUpdatingStatus(taskUid);
    try {
      const formatDate = (date: any) =>
        date ? new Date(date).toISOString().split("T")[0] : "";

      await dispatch(
        updateTask({
          Uid: taskUid,
          Name: task.Name,
          UserName: task.UserName,
          Stack: task.Stack,
          StartDate: formatDate(task.StartDate),
          EndDate: formatDate(task.EndDate),
          Status: newStatus,
          Description: task.Description,
        })
      ).unwrap();

      dispatch(fetchAllTasks({ PageSize: 10, PageIndex: 1, SortBy: null }));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(null);
      setStatusDropdownOpen(null);
    }
  };

  // ✅ Handle description view
  const handleViewDescription = (task: TaskItem) => {
    setSelectedDescription(task);
    setIsDescriptionModalOpen(true);
  };

  // ✅ Columns for table
  const columns: Column<TaskItem>[] = useMemo(
    () => [
      { key: "Name", label: "Task Name" },
      { key: "UserName", label: "Assigned To" },
      { key: "Stack", label: "Stack" },
      {
        key: "StartDate",
        label: "Start Date",
        render: (value) => formatDate(value),
      },
      {
        key: "EndDate",
        label: "End Date",
        render: (value) => formatDate(value),
      },
      {
        key: "Status",
        label: "Status",
        render: (value, row) => (
          <div className="relative inline-block">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                setDropdownPosition({
                  top: rect.bottom + window.scrollY,
                  left: rect.left + window.scrollX,
                });
                setStatusDropdownOpen(
                  statusDropdownOpen === row.Uid ? null : row.Uid
                );
              }}
              disabled={updatingStatus === row.Uid}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                value
              )} hover:opacity-80 transition-opacity disabled:opacity-50`}
            >
              <span>
                {statusOptions.find((opt) => opt.value === value)?.label ||
                  value}
              </span>
              <svg
                className="w-3 h-3"
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
            </button>
          </div>
        ),
      },
      {
        key: "Description",
        label: "Description",
        render: (value, row) => (
          <button
            onClick={() => handleViewDescription(row)}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            View
          </button>
        ),
      },
      {
        key: "CreatedOn",
        label: "Created On",
        render: (value) => formatDate(value),
      },
      {
        key: "Uid",
        label: "Actions",
        render: (value, row) => (
          <div className="flex gap-2">
            <BaseButton
              size="sm"
              variant="outline"
              onClick={() => handleEdit(row)}
            >
              Edit
            </BaseButton>
            <BaseButton
              size="sm"
              variant="danger"
              onClick={() => handleDeleteClick(row)}
            >
              Delete
            </BaseButton>
          </div>
        ),
      },
    ],
    [statusDropdownOpen, updatingStatus]
  );

  // ✅ Handlers
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setSelectedTaskUid(null);
    setFormData({
      name: "",
      userName: "",
      stack: "",
      startDate: "",
      endDate: "",
      status: "active",
      description: "",
    });
  };

  const handleEdit = (task: TaskItem) => {
    setEditMode(true);
    setSelectedTaskUid(task.Uid);
    setFormData({
      name: task.Name,
      userName: task.UserName,
      stack: task.Stack,
      startDate: task.StartDate?.split("T")[0] || "",
      endDate: task.EndDate?.split("T")[0] || "",
      status: task.Status,
      description: task.Description,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (task: TaskItem) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    setDeleteLoading(true);
    try {
      await dispatch(deleteTask(taskToDelete.Uid)).unwrap();
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCreateTask = async () => {
    setFormLoading(true);
    try {
      await dispatch(
        createTask({
          Name: formData.name,
          UserName: formData.userName,
          Stack: formData.stack,
          StartDate: formData.startDate,
          EndDate: formData.endDate,
          Status: formData.status,
          Description: formData.description,
        })
      ).unwrap();

      handleModalClose();
      dispatch(fetchAllTasks({ PageSize: 10, PageIndex: 1, SortBy: null }));
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTaskUid) return;

    setFormLoading(true);
    try {
      await dispatch(
        updateTask({
          Uid: selectedTaskUid,
          Name: formData.name,
          UserName: formData.userName,
          Stack: formData.stack,
          StartDate: formData.startDate,
          EndDate: formData.endDate,
          Status: formData.status,
          Description: formData.description,
        })
      ).unwrap();

      handleModalClose();
      dispatch(fetchAllTasks({ PageSize: 10, PageIndex: 1, SortBy: null }));
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = () => {
    if (editMode) {
      handleUpdateTask();
    } else {
      handleCreateTask();
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Task", active: true },
        ]}
      />

      <div className="mt-2 flex justify-end">
        <BaseButton size={componentSize} onClick={() => setIsModalOpen(true)}>
          Create Task
        </BaseButton>
      </div>

      <div className="mt-3">
        <BaseTable
          data={data || []}
          columns={columns}
          keyExtractor={(row) => row.Uid}
          loading={loading}
          hoverable
          emptyMessage="No tasks found"
          className="shadow"
        />
      </div>

      {/* ✅ Task Create/Edit Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={editMode ? "Edit Task" : "Create New Task"}
        size={componentSize}
        submitText={editMode ? "Update" : "Create"}
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <BaseInput
            label="Task Name"
            placeholder="Enter task name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            size={componentSize}
            fullWidth
          />

          <BaseSelect
            label="Assigned To"
            value={formData.userName}
            onChange={(value) => setFormData({ ...formData, userName: value })}
            options={userNameOptions}
            size={componentSize}
            fullWidth
            required
          />

          <BaseInput
            label="Stack"
            placeholder="Enter stack (e.g., React, Node)"
            value={formData.stack}
            onChange={(e) =>
              setFormData({ ...formData, stack: e.target.value })
            }
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
            size={componentSize}
            fullWidth
          />

          <BaseSelect
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value })}
            options={statusOptions}
            size={componentSize}
            fullWidth
            required
          />

          <BaseInput
            label="Description"
            placeholder="Enter description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            size={componentSize}
            fullWidth
          />
        </div>
      </BaseModal>

      {/* ✅ Delete Confirmation Modal */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onSubmit={handleDeleteConfirm}
        title="Delete Task"
        size="md"
        submitText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this task?
          </p>
          {taskToDelete && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-semibold text-gray-900">{taskToDelete.Name}</p>
              <p className="text-sm text-gray-600 mt-1">
                Assigned to: {taskToDelete.UserName}
              </p>
              <p className="text-sm text-gray-600">
                Status: {taskToDelete.Status}
              </p>
            </div>
          )}
          <p className="text-sm text-red-600">This action cannot be undone.</p>
        </div>
      </BaseModal>

      {/* ✅ Description View Modal */}
      <BaseModal
        isOpen={isDescriptionModalOpen}
        onClose={() => {
          setIsDescriptionModalOpen(false);
          setSelectedDescription(null);
        }}
        title="Task Description"
        size="md"
        submitText="Close"
        onSubmit={() => {
          setIsDescriptionModalOpen(false);
          setSelectedDescription(null);
        }}
        // hideCancelButton
      >
        {selectedDescription && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                {selectedDescription.Name}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Assigned to:</span>{" "}
                  {selectedDescription.UserName}
                </p>
                <p>
                  <span className="font-medium">Stack:</span>{" "}
                  {selectedDescription.Stack}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(
                      selectedDescription.Status
                    )}`}
                  >
                    {statusOptions.find(
                      (opt) => opt.value === selectedDescription.Status
                    )?.label || selectedDescription.Status}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedDescription.Description || "No description provided."}
              </p>
            </div>
          </div>
        )}
      </BaseModal>

      {/* ✅ Status Dropdown Portal */}
      {statusDropdownOpen && dropdownPosition && (
        <div
          style={{
            position: "fixed",
            top: `${dropdownPosition.top + 4}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 9999,
          }}
          className="w-40 bg-white border border-gray-200 rounded-md shadow-lg"
        >
          {statusOptions.map((option) => {
            const currentTask = data?.find(
              (task) => task.Uid === statusDropdownOpen
            );
            return (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentTask) {
                    handleStatusChange(
                      statusDropdownOpen,
                      currentTask,
                      option.value
                    );
                  }
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                  option.value === currentTask?.Status
                    ? "bg-gray-50 font-medium"
                    : ""
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Task;

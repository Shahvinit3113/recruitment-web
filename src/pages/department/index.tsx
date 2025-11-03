import type { departmentItem } from "@/api/types/department";
import BaseButton from "@/baseComponent/BaseButton";
import BaseInput from "@/baseComponent/BaseInput";
import BaseModal from "@/baseComponent/BaseModal";
import type { Column } from "@/baseComponent/BaseTable";
import BaseTable from "@/baseComponent/BaseTable";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  createDepartment,
  deleteDepartment,
  fetchAllDepartments,
  updateDepartment,
} from "@/Redux/Slices/Department/department";
import type { AppDispatch, RootState } from "@/Redux/Store";
import { formatDate } from "@/utils/formatDate";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Department: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.department
  );
  const componentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingDept, setEditingDept] = useState<departmentItem | null>(null);
  const [deletingDept, setDeletingDept] = useState<departmentItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    dispatch(fetchAllDepartments({ PageSize: 10, PageIndex: 1, SortBy: null }));
  }, [dispatch]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        Name: formData.name,
        Description: formData.description,
      };

      let result;
      if (editingDept) {
        // Update existing department
        result = await dispatch(
          updateDepartment({
            Uid: editingDept.Uid,
            Name: formData.name,
            Description: formData.description,
          })
        ).unwrap();
      } else {
        // Create new department
        result = await dispatch(createDepartment(payload)).unwrap();
      }

      if (result) {
        dispatch(
          fetchAllDepartments({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        setIsModalOpen(false);
        setEditingDept(null);
        setFormData({
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error saving department:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (dept: departmentItem) => {
    setEditingDept(dept);
    setFormData({
      name: dept.Name || "",
      description: dept.Description || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (dept: departmentItem) => {
    setDeletingDept(dept);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingDept) return;

    setFormLoading(true);
    try {
      const result = await dispatch(
        deleteDepartment(deletingDept.Uid)
      ).unwrap();

      if (result) {
        dispatch(
          fetchAllDepartments({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        setIsDeleteModalOpen(false);
        setDeletingDept(null);
      }
    } catch (error) {
      console.error("Error deleting deaprtment:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: Column<departmentItem>[] = useMemo(
    () => [
      {
        key: "Name",
        label: "Name",
        sortable: true,
        render: (value) => (
          <span className="font-medium text-gray-900">{value || "N/A"}</span>
        ),
      },
      {
        key: "CreatedOn",
        label: "Created",
        sortable: true,
        render: (value) => (
          <span className="text-gray-600 text-sm">{formatDate(value)}</span>
        ),
      },
      {
        key: "IsActive",
        label: "Status",
        align: "center",
        sortable: true,
        render: (value) => (
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              value === 1 || value === true
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value === 1 || value === true ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        align: "center",
        render: (_, row) => (
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
    []
  );

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Department", active: true },
        ]}
      />

      <div>
        <div className="mt-1 flex justify-end">
          <BaseButton
            size={componentSize}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Create Department
          </BaseButton>
        </div>

        <div className="mt-3">
          <BaseTable
            data={data || []}
            columns={columns}
            keyExtractor={(row) => row.Uid || String(Math.random())}
            loading={loading}
            hoverable
            emptyMessage="No department found"
            className="shadow"
          />
        </div>
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateDepartment}
        title={editingDept ? "Edit Department" : "Create New Department"}
        size={componentSize}
        submitText={editingDept ? "Update" : "Create"}
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <BaseInput
            label="Department Name"
            placeholder="Enter department name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            size={componentSize}
            fullWidth
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
            multiline={true}
            rows={2}
          />
        </div>
      </BaseModal>

      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingDept(null);
        }}
        onSubmit={handleDelete}
        title="Delete Department"
        size={componentSize}
        submitText="Delete"
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the department{" "}
            <span className="font-semibold">{deletingDept?.Name}</span>?
          </p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
        </div>
      </BaseModal>
    </>
  );
};

export default Department;

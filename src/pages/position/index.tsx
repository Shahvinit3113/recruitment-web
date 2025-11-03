import type { positionItem } from "@/api/types/position";
import BaseButton from "@/baseComponent/BaseButton";
import BaseInput from "@/baseComponent/BaseInput";
import BaseModal from "@/baseComponent/BaseModal";
import BaseSelect from "@/baseComponent/BaseSelect";
import type { Column } from "@/baseComponent/BaseTable";
import BaseTable from "@/baseComponent/BaseTable";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {
  createPosition,
  deletePosition,
  fetchAllPositions,
  updatePosition,
} from "@/Redux/Slices/Position/position";
import { fetchAllDepartments } from "@/Redux/Slices/Department/department";
import type { AppDispatch, RootState } from "@/Redux/Store";
import { formatDate } from "@/utils/formatDate";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Position: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading } = useSelector((state: RootState) => state.position);

  const { data: deptData, loading: deptLoading } = useSelector(
    (state: RootState) => state.department
  );
  console.log(deptData, "deptData");
  const componentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState<positionItem | null>(null);
  const [deleting, setDeleting] = useState<positionItem | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
  });

  useEffect(() => {
    dispatch(fetchAllPositions({ PageSize: 10, PageIndex: 1, SortBy: null }));
    dispatch(fetchAllDepartments({ PageSize: 50, PageIndex: 1, SortBy: null }));
  }, [dispatch]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditing(null);
    setFormData({
      name: "",
      description: "",
      departmentId: "",
    });
  };

  const handleCreatePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        Name: formData.name,
        Description: formData.description,
        DepartmentId: formData.departmentId,
      };

      let result;
      if (editing) {
        result = await dispatch(
          updatePosition({
            Uid: editing.Uid,
            ...payload,
          })
        ).unwrap();
      } else {
        result = await dispatch(createPosition(payload)).unwrap();
      }

      if (result) {
        dispatch(
          fetchAllPositions({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        handleModalClose();
      }
    } catch (error) {
      console.error("Error saving position:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (dept: positionItem) => {
    setEditing(dept);
    setFormData({
      name: dept.Name || "",
      description: dept.Description || "",
      departmentId: dept.DepartmentId || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (dept: positionItem) => {
    setDeleting(dept);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setFormLoading(true);

    try {
      const result = await dispatch(deletePosition(deleting.Uid)).unwrap();
      if (result) {
        dispatch(
          fetchAllPositions({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        setIsDeleteModalOpen(false);
        setDeleting(null);
      }
    } catch (error) {
      console.error("Error deleting position:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: Column<positionItem>[] = useMemo(
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
        key: "Department",
        label: "Department",
        sortable: true,
        render: (value) => (
          <span className="text-gray-700">{value || "N/A"}</span>
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
        key: "Status",
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
          { label: "Position", active: true },
        ]}
      />

      <div>
        <div className="mt-1 flex justify-end">
          <BaseButton
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Create Position
          </BaseButton>
        </div>

        <div className="mt-3">
          <BaseTable
            data={data || []}
            columns={columns}
            keyExtractor={(row) => row.Uid || String(Math.random())}
            loading={loading}
            hoverable
            emptyMessage="No position found"
            className="shadow"
          />
        </div>
      </div>

      {/* ✅ Create/Edit Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreatePosition}
        title={editing ? "Edit Position" : "Create New Position"}
        size={componentSize}
        submitText={editing ? "Update" : "Create"}
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <BaseInput
            label="Position Name"
            placeholder="Enter position name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            size={componentSize}
            fullWidth
          />

          <BaseSelect
            label="Select Department"
            // helperText="Choose department"
            options={
              deptData?.map((dept) => ({
                label: dept.Name,
                value: dept.Uid,
              })) || []
            }
            value={formData.departmentId}
            onChange={(value: string) =>
              setFormData({ ...formData, departmentId: value })
            }
            required
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

      {/* ✅ Delete Confirmation */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleting(null);
        }}
        onSubmit={handleDelete}
        title="Delete Position"
        size={componentSize}
        submitText="Delete"
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the position{" "}
            <span className="font-semibold">{deleting?.Name}</span>?
          </p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
        </div>
      </BaseModal>
    </>
  );
};

export default Position;

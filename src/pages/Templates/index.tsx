import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/Redux/Store";
import {
  createTemplate,
  deleteTemplate,
  fetchAllTemplates,
  updateTemplate,
} from "@/Redux/Slices/Template/template";
import type { Column } from "@/baseComponent/BaseTable";
import type { templateItem } from "@/api/types/template";
import BaseButton from "@/baseComponent/BaseButton";
import { formatDate } from "@/utils/formatDate";
import BaseTable from "@/baseComponent/BaseTable";
import BaseModal from "@/baseComponent/BaseModal";
import BaseInput from "@/baseComponent/BaseInput";
import { useNavigate } from "react-router-dom";

const Template: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.template
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<templateItem | null>(null);
  const [deletingDept, setDeletingDept] = useState<templateItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    dispatch(fetchAllTemplates({ PageSize: 10, PageIndex: 1, SortBy: null }));
  }, [dispatch]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleEdit = (dept: templateItem) => {
    setEditingDept(dept);
    setFormData({
      name: dept.Name || "",
      description: dept.Description || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (dept: templateItem) => {
    setDeletingDept(dept);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingDept) return;

    setFormLoading(true);
    try {
      const result = await dispatch(deleteTemplate(deletingDept.Uid)).unwrap();

      if (result) {
        dispatch(
          fetchAllTemplates({ PageSize: 10, PageIndex: 1, SortBy: null })
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

  const columns: Column<templateItem>[] = useMemo(
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
        key: "Description",
        label: "description",
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
        key: "actions",
        label: "Actions",
        // align: "center",
        render: (_, row) => (
          <div className="flex gap-2">
            <BaseButton
              size="sm"
              variant="primary"
              onClick={() => navigate(`/templates/${row.Uid}`)}
            >
              View
            </BaseButton>
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

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        Name: formData.name,
        Description: formData.description,
      };

      let result;
      if (editingDept) {
        // Update existing template
        result = await dispatch(
          updateTemplate({
            Uid: editingDept.Uid,
            Name: formData.name,
            Description: formData.description,
          })
        ).unwrap();
      } else {
        // Create new template
        result = await dispatch(createTemplate(payload)).unwrap();
      }

      if (result) {
        dispatch(
          fetchAllTemplates({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        setIsModalOpen(false);
        setEditingDept(null);
        setFormData({
          name: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Template", active: true },
        ]}
      />

      <div>
        <div className="mt-1 flex justify-end">
          <BaseButton
            // size={componentSize}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Create Template
          </BaseButton>
        </div>

        <div className="mt-3">
          <BaseTable
            data={data || []}
            columns={columns}
            keyExtractor={(row) => row.Uid || String(Math.random())}
            loading={loading}
            hoverable
            emptyMessage="No template found"
            className="shadow"
          />
        </div>
      </div>

      <BaseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateTemplate}
        title={editingDept ? "Edit Template" : "Create New Template"}
        // size={componentSize}
        submitText={editingDept ? "Update" : "Create"}
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <BaseInput
            label="Template Name"
            placeholder="Enter template name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        // size={componentSize}
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

export default Template;

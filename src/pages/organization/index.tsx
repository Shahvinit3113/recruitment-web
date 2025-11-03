import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrganizations,
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "@/Redux/Slices/Organization/organization";
import type { AppDispatch, RootState } from "@/Redux/Store";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BaseTable from "@/baseComponent/BaseTable";
import type { Column } from "@/baseComponent/BaseTable";
import BaseButton from "@/baseComponent/BaseButton";
import BaseModal from "@/baseComponent/BaseModal";
import BaseInput from "@/baseComponent/BaseInput";

type OrganizationItem = RootState["organization"]["data"][number];

const Organization: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.organization
  );
  const componentSize = useSelector(
    (state: RootState) => state.settings.componentSize
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationItem | null>(null);
  const [deletingOrg, setDeletingOrg] = useState<OrganizationItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    orgSite: "",
  });

  useEffect(() => {
    dispatch(
      fetchAllOrganizations({ PageSize: 10, PageIndex: 1, SortBy: null })
    );
  }, [dispatch]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleEdit = (org: OrganizationItem) => {
    setEditingOrg(org);
    setFormData({
      name: org.Name || "",
      owner: org.Owner || "",
      email: org.Email || "",
      phone: org.Phone || "",
      description: org.Description || "",
      address: org.Address || "",
      orgSite: org.OrgSite || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (org: OrganizationItem) => {
    setDeletingOrg(org);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingOrg) return;

    setFormLoading(true);
    try {
      const result = await dispatch(
        deleteOrganization(deletingOrg.Uid)
      ).unwrap();

      if (result?.IsSuccess) {
        dispatch(
          fetchAllOrganizations({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        setIsDeleteModalOpen(false);
        setDeletingOrg(null);
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns: Column<OrganizationItem>[] = useMemo(
    () => [
      {
        key: "Name",
        label: "Organization Name",
        sortable: true,
        render: (value) => (
          <span className="font-medium text-gray-900">{value || "N/A"}</span>
        ),
      },
      {
        key: "Owner",
        label: "Owner",
        sortable: true,
        render: (value) => (
          <span className="text-gray-700">{value || "N/A"}</span>
        ),
      },
      {
        key: "Email",
        label: "Email",
        render: (value) => (
          <a
            href={`mailto:${value}`}
            className="text-blue-600 hover:text-blue-800 truncate"
            title={value}
          >
            {value}
          </a>
        ),
      },
      {
        key: "Phone",
        label: "Phone",
        render: (value) => (
          <a
            href={`tel:${value}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {value || "N/A"}
          </a>
        ),
      },
      {
        key: "Description",
        label: "Description",
        render: (value) => (
          <span className="text-gray-600 truncate max-w-xs block" title={value}>
            {value || "—"}
          </span>
        ),
      },
      {
        key: "Address",
        label: "Address",
        render: (value) => (
          <span className="text-gray-600 truncate max-w-xs block" title={value}>
            {value || "—"}
          </span>
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
          <div className="flex items-center justify-center gap-2">
            <BaseButton
              size="sm"
              variant="outline"
              onClick={() => handleEdit(row)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              Edit
            </BaseButton>
            <BaseButton
              size="sm"
              variant="outline"
              onClick={() => handleDeleteClick(row)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              Delete
            </BaseButton>
          </div>
        ),
      },
    ],
    []
  );

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        Name: formData.name,
        Description: formData.description,
        LogoUrl: "default_logo.png",
        Phone: formData.phone,
        Email: formData.email,
        Owner: formData.owner,
        Address: formData.address,
        OrgSite: formData.orgSite || "defaultsite.com",
      };

      let result;
      if (editingOrg) {
        // Update existing organization
        result = await dispatch(
          updateOrganization({
            id: editingOrg.Uid,
            data: payload,
          })
        ).unwrap();
      } else {
        // Create new organization
        result = await dispatch(createOrganization(payload)).unwrap();
      }

      if (result?.IsSuccess) {
        dispatch(
          fetchAllOrganizations({ PageSize: 10, PageIndex: 1, SortBy: null })
        );
        setIsModalOpen(false);
        setEditingOrg(null);
        setFormData({
          name: "",
          owner: "",
          email: "",
          phone: "",
          description: "",
          address: "",
          orgSite: "",
        });
      }
    } catch (error) {
      console.error("Error saving organization:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOrg(null);
    setFormData({
      name: "",
      owner: "",
      email: "",
      phone: "",
      description: "",
      address: "",
      orgSite: "",
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Organizations", active: true },
          ]}
        />
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">
            Error loading organizations
          </p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Organizations", active: true },
        ]}
      />

      <div>
        <div className="mt-1 flex justify-end">
          <BaseButton
            size={componentSize}
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Create Organization
          </BaseButton>
        </div>

        <div className="mt-3">
          <BaseTable
            data={data || []}
            columns={columns}
            keyExtractor={(row) => row.uid || row.id || String(Math.random())}
            loading={loading}
            hoverable
            emptyMessage="No organizations found"
            className="shadow"
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleCreateOrganization}
        title={editingOrg ? "Edit Organization" : "Create New Organization"}
        size={componentSize}
        submitText={editingOrg ? "Update" : "Create"}
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <BaseInput
            label="Organization Name"
            placeholder="Enter organization name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="Owner"
            placeholder="Enter owner name"
            value={formData.owner}
            onChange={(e) =>
              setFormData({ ...formData, owner: e.target.value })
            }
            required
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="Phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="Address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            size={componentSize}
            fullWidth
          />

          <BaseInput
            label="Organization Site"
            placeholder="Enter website (optional)"
            value={formData.orgSite}
            onChange={(e) =>
              setFormData({ ...formData, orgSite: e.target.value })
            }
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

      {/* Delete Confirmation Modal */}
      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingOrg(null);
        }}
        onSubmit={handleDelete}
        title="Delete Organization"
        size={componentSize}
        submitText="Delete"
        cancelText="Cancel"
        loading={formLoading}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete the organization{" "}
            <span className="font-semibold">{deletingOrg?.Name}</span>?
          </p>
          <p className="text-red-600 text-sm">This action cannot be undone.</p>
        </div>
      </BaseModal>
    </>
  );
};

export default Organization;

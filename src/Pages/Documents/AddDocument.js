import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import {
  GET_STATUS_API,
  getProjects,
  GET_DOCUMENT_API,
  ADD_DOCUMENT_API,
  UPDATE_DOCUMENT_API,
} from "../../Constants/apiRoutes";

const AddDocument = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const [documentNo, setDocumentNo] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [statusId, setStatusId] = useState("");
  const [projectTypeId, setProjectTypeId] = useState("");
  const [statuses] = useState([
    { id: 1, name: "Approved" },
    { id: 2, name: "Pending" },
    { id: 3, name: "Rejected" },
  ]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for combo dropdowns
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusQuery, setStatusQuery] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState(null);
  const [projectTypeQuery, setProjectTypeQuery] = useState("");

  // State for file upload
  const [documentFile, setDocumentFile] = useState(null); // New state for the uploaded document file

  useEffect(() => {
    const fetchProjectTypes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(getProjects, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjectTypes(response.data.data || []);
      } catch (error) {
        console.error("Error fetching project types", error);
      }
    };

    const fetchDocumentData = async () => {
      if (documentId && documentId !== "new") {
        try {
          const response = await axios.get(`${GET_DOCUMENT_API}/${documentId}`);
          const documentData = response.data;
          setDocumentNo(documentData.DocumentNo);
          setDocumentName(documentData.DocumentName);
          setCustomerName(documentData.CustomerName);
          setStatusId(documentData.StatusId);
          setProjectTypeId(documentData.ProjectType);
          // Set selected status and project type based on fetched data
          const status = statuses.find((s) => s.id === documentData.StatusId);
          const projectType = projectTypes.find(
            (pt) => pt.ProjectTypeID === documentData.ProjectType
          );
          setSelectedStatus(status);
          setSelectedProjectType(projectType);
        } catch (error) {
          console.error("Error fetching document data", error);
        }
      } else {
        // Set default values for a new document
        setDocumentNo("");
        setDocumentName("");
        setCustomerName("");
        setStatusId("");
        setProjectTypeId("");
        setSelectedStatus(null);
        setSelectedProjectType(null);
      }
    };

    fetchProjectTypes();
    fetchDocumentData();
  }, []);

  const handleUploadDocument = async () => {
    if (
      !documentName ||
      !customerName ||
      !selectedStatus ||
      !selectedProjectType ||
      !documentFile // Check if documentFile is selected
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData(); // Create a new FormData object
    formData.append("DocumentNo", documentId ? documentNo : undefined);
    formData.append("DocumentName", documentName);
    formData.append("CustomerName", customerName);
    formData.append("StatusId", selectedStatus.id);
    formData.append("ProjectType", selectedProjectType.ProjectTypeID);
    formData.append("DocumentFile", documentFile); // Append the file to FormData
// Get TenantId from local storage
const tenantId = localStorage.getItem("TenantID");
if (tenantId) {
  formData.append("TenantId", tenantId); // Append TenantId to FormData
}

    setIsLoading(true);

    try {
      if (documentId && documentId !== "new") {
        // Update existing document
        const response = await axios.put(
          `${UPDATE_DOCUMENT_API}/${documentId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
            },
          }
        );
        if (response.data.StatusCode === "SUCCESS") {
          toast.success("Document updated successfully!");
        } else {
          toast.error(response.data.message || "Failed to update document.");
        }
      } else {
        // Add new document
        const response = await axios.post(ADD_DOCUMENT_API, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
          },
        });
        if (response.data.StatusCode === "SUCCESS") {
          toast.success("Document added successfully!");
        } else {
          toast.error(response.data.message || "Failed to add document.");
        }
      }
      navigate("/documentsList");
    } catch (error) {
      console.error("Error saving document", error);
      toast.error("An error occurred while saving the document.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container">
      <h2 className="text-lg font-semibold mb-4 text-custom-brown">
        {documentId !== "new" ? "Update Document" : "Add Document"}
      </h2>

      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 px-16 md:px-24 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter document name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="Enter customer name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 px-16 md:px-24 mb-4">
        {/* Status Dropdown */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <Combobox value={selectedStatus} onChange={setSelectedStatus}>
            <div className="relative">
              <Combobox.Input
                className="block w-full rounded-md border border-gray-400 py-2 px-4 shadow-sm sm:text-sm mt-2 mb-1"
                onChange={(event) => setStatusQuery(event.target.value)}
                displayValue={(status) => status?.name || ""}
                placeholder="Select Status"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {statuses
                  .filter((status) =>
                    status.name
                      .toLowerCase()
                      .includes(statusQuery.toLowerCase())
                  )
                  .map((status) => (
                    <Combobox.Option
                      key={status.id}
                      value={status}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                        {status.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </Combobox.Option>
                  ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>

        {/* Project Type Dropdown */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">
            Project Type <span className="text-red-500">*</span>
          </label>
          <Combobox
            value={selectedProjectType}
            onChange={setSelectedProjectType}
          >
            <div className="relative">
              <Combobox.Input
                className="block w-full rounded-md border border-gray-400 py-2 px-4 shadow-sm sm:text-sm mt-2 mb-1"
                onChange={(event) => setProjectTypeQuery(event.target.value)}
                displayValue={(projectType) =>
                  projectType?.ProjectTypeName || ""
                }
                placeholder="Select Project Type"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {projectTypes
                  .filter((projectType) =>
                    projectType.ProjectTypeName.toLowerCase().includes(
                      projectTypeQuery.toLowerCase()
                    )
                  )
                  .map((projectType) => (
                    <Combobox.Option
                      key={projectType.ProjectTypeID}
                      value={projectType}
                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                    >
                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                        {projectType.ProjectTypeName}
                      </span>
                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </Combobox.Option>
                  ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>
      </div>

      {/* New Input Field for Document File Upload */}
      <div className="mb-4 px-16 md:px-24">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Document <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          onChange={(e) => setDocumentFile(e.target.files[0])} // Set the document file
          className="w-[48%] p-2 border rounded-lg"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleUploadDocument}
          className="flex items-center px-4 py-2 bg-[#8B4513] text-white rounded-lg"
        >
          {/* <FaPlus className="mr-2" /> */}
          <span>{documentId !== "new" ? "Update" : "Upload"}</span>
        </button>
      </div>
    </div>
  );
};

export default AddDocument;

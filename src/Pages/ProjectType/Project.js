import React, { useState, useRef, useEffect } from "react";
import { FiTrash, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
import {
  createProject,
  updateProject,
  getProjectTypeById,
} from "../../Constants/apiRoutes";
import { useParams } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
const AddProject = () => {
  const [formData, setFormData] = useState({
    storeId: "",
    projectName: "",
    isActive: false,
    imageFile: null,
    imagePreview: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { ProjectTypeID } = useParams();
  const [projectType, setProjectType] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setFormData((prevData) => ({
        ...prevData,
        imageFile: file,
      }));
    }
  };

  const handleCancel = () => {
    navigate("/Project"); // Navigate to the project list page
  };

  const handleDelete = () => {
    setFormData((prevData) => ({
      ...prevData,
      imagePreview: null,
      imageFile: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleView = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors({ ...errors, [name]: "" });
  };
  const validateForm = () => {
    const formErrors = {};

    if (!formData.projectName.trim()) {
      formErrors.projectName = "Project Name is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // No errors = valid
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (ProjectTypeID) {
      axios
        .get(`${getProjectTypeById}/${ProjectTypeID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // Validate that the response structure matches the expected format
          if (
            response.data &&
            response.data.message === "Project Type retrieved successfully"
          ) {
            setProjectType(response.data.data); // Update state with project type data
          } else {
            console.error("Unexpected response structure:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching project type data:", error);
        });
    }
  }, [ProjectTypeID]);
  useEffect(() => {
    if (editMode) {
      setFormData({
        projectName: projectType.ProjectTypeName?.replace(/['"]/g, "") || "",
        isActive: projectType.Status || "",
        imageFile: projectType.FileUrl, // Update if required from store
        imagePreview: projectType.FileUrl, // Update if required from store
      });
    }
  }, [editMode, projectType]);
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
  
      const projectData = {
        ProjectTypeName: String(formData.projectName),
        Status: formData.isActive ? "Active" : "Inactive",
        CreatedBy: "admin",
      };
  
      const token = localStorage.getItem("token");
  
      try {
        const response = await axios.post(createProject, projectData, {
          headers: {
            "Content-Type": "application/json", // Changed to JSON
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Show success toast notification
        toast.success(response.data.message || "Project added successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        // Reset form fields
        setFormData({
          storeId: "", // Clear storeId
          projectName: "", // Clear projectName
          isActive: false, // Reset isActive to false
          imageFile: null, // Clear imageFile
          imagePreview: null, // Clear imagePreview
        });
  
        // Clear file input field
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
  
        setTimeout(() => {
          handleCancel(); // Call the handleCancel function after the delay
        }, 3000);
      } catch (error) {
        // Show error toast notification
        toast.error(error.response?.data?.message || "Failed to add project!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
  
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (ProjectTypeID) {
      setEditMode(Boolean(ProjectTypeID)); // Set editMode based on categoryData
    }
  }, [ProjectTypeID]);
 const handleProjectUpdate = async () => {
    setLoading(true);
  
    const projectData = {
      ProjectTypeName: formData.projectName,
      Status: formData.isActive, // Match backend expectations
      UploadDocument: formData.imageFile, // Ensure backend accepts this as a normal file path or URL
      CreatedBy: "admin",
      UpdatedBy: "admin",
    };
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.put(
        `${updateProject}/${ProjectTypeID}`, // Include project ID in the URL
        projectData,
        {
          headers: {
            "Content-Type": "application/json", // Changed to JSON
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Show success toast notification
      toast.success(response.data.message || "Project updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // Reset form fields
      setFormData({
        storeId: "", // Clear storeId
        projectName: "", // Clear projectName
        isActive: false, // Reset isActive to false
        imageFile: null, // Clear imageFile
        imagePreview: null, // Clear imagePreview
        projectId: "", // Clear projectId for subsequent submissions
      });
  
      // Clear file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  
      setTimeout(() => {
        handleCancel(); // Call the handleCancel function after the delay
      }, 3000);
    } catch (error) {
      // Show error toast notification
      toast.error(error.response?.data?.message || "Failed to update project!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  
    setLoading(false);
  };
  
  return (
    <div className="main-container">
      <div className="mt-6 p-6 bg-white">
        <ToastContainer />
        <h2 className="heading">
          {editMode ? "Update Project" : "Add Project"}
        </h2>
        <hr className="border-gray-300 my-4 mb-4" />

        <div>
          {/* Project Name */}
          <div className="mt-8 mb-4 flex items-center">
            <label className="block font-semibold w-1/3 text-right pr-4 mb-6">
              Project Name <span className="text-red-500">*</span>:
            </label>
            <div className="w-2/3">
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                className={`border p-2 w-full sm:w-1/2 rounded-md ${
                  errors.projectName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Project Name"
              />
              <p
                className={`text-red-500 text-sm h-5 ${
                  errors.projectName ? "visible" : "invisible"
                }`}
              >
                {errors.projectName}
              </p>
            </div>
          </div>

          {/* Is Active */}
          <div className="mb-4 flex items-center">
            <label className="block font-semibold w-1/3 text-right pr-4">
              Is Active:
            </label>
            <div className="w-2/3">
              <div
                onClick={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    isActive:
                      prevData.isActive === "Active" ? "Inactive" : "Active",
                  }))
                }
                className={`relative w-14 h-6 rounded-full cursor-pointer transition ${
                  formData.isActive === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    formData.isActive === "Active"
                      ? "translate-x-8"
                      : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex ml-96 justify-center space-x-4">
            <button
              type="button"
              className="button-base save-btn"
              onClick={editMode ? handleProjectUpdate : handleSubmit}
            >
              {editMode ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="button-base save-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {loading && <LoadingAnimation />}
    </div>
  );
};

export default AddProject;

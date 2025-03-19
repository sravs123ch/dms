import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTable, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { Combobox } from "@headlessui/react";
import Datepicker from "react-tailwindcss-datepicker";
import {
  getProjects,
  deleteProjectType,
  updateProject,
} from "../../Constants/apiRoutes";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { toast, ToastContainer } from "react-toastify";
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
import "react-toastify/dist/ReactToastify.css";
import { IoEllipsisVertical } from "react-icons/io5";

const ProjectTable = () => {
  const [page, setPage] = useState(0);
  const dropdownRef = useRef(null);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [value, setValue] = useState(null);
  const storesData = [
    { StoreID: 1, StoreName: "Store 1" },
    { StoreID: 2, StoreName: "Store 2" },
  ];
  const stores = storesData;
  const searchName = "";
  const searchItems = (value) => console.log("Searching for:", value);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paginatedData, setPaginatedData] = useState([]);
  const navigate = useNavigate();
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingName, setEditingName] = useState("");

  const handleCreateProject = () => {
    navigate("/ProjectCreation");
  };
  const handleExportOrder = () =>
    alert("Export Order functionality not implemented.");
  const handleEditProject = (project) => {
    setEditingProjectId(project.ProjectTypeID);
    setEditingStatus(project.Status);
    setEditingName(project.ProjectTypeName);
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(getProjects, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProjects(response.data.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [refresh]);

  useEffect(() => {
    const filteredProjects = projects.filter(
      (project) =>
        (project.ProjectTypeName &&
          project.ProjectTypeName.toLowerCase().includes(
            searchQuery.toLowerCase()
          )) ||
        (project.ProjectTypeID &&
          project.ProjectTypeID.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );

    const paginatedData = filteredProjects.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    setPaginatedData(paginatedData);
  }, [searchQuery, projects, page, rowsPerPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveMenu(null); // Close the menu
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleDeleteProject = async (ProjectTypeID) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${deleteProjectType}/${ProjectTypeID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        // Display success toast if the project is deleted successfully
        toast.success(result.message || "Project deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRefresh((prev) => !prev); // Refresh the data if necessary
      } else {
        // Display error toast if deletion fails
        toast.error(
          result.message || `Failed to delete project with ID ${ProjectTypeID}`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    } catch (error) {
      // Handle any unexpected errors during the request
      console.error("Error:", error);
      toast.error("An error occurred while deleting the project", {
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
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (projectTypeID) => {
    setActiveMenu(activeMenu === projectTypeID ? null : projectTypeID);
  };

  const handleSaveProject = async (projectTypeID) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${updateProject}/${projectTypeID}`,
        { Status: editingStatus, ProjectTypeName: editingName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
     
         toast.success(response.data.message || "Project added successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setRefresh((prev) => !prev);
      
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("An error occurred while updating the project.");
    } finally {
      setLoading(false);
      setEditingProjectId(null);
      setEditingStatus("");
      setEditingName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditingStatus("");
    setEditingName("");
  };

  return (
    <div ref={dropdownRef} className={`main-container`}>
      <ToastContainer />
      {loading && <LoadingAnimation />}
      <div className="body-container">
        <h2 className="heading">Projects</h2>

        <div className="flex justify-end">
          <ul>
            <li>
              <button
                type="button"
                className="action-button flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateProject}
              >
                <FaPlus aria-hidden="true" className="icon" />
                <span>Create Project</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 mt-2">
        {/* Container for centering search box */}
        <div className="flex justify-center items-center w-full mt-4">
          <div className="relative flex items-center">
            <label htmlFor="searchName" className="sr-only">
              Search
            </label>
            <input
              id="searchName"
              type="text"
              placeholder=" Search by Project Number / Project Name "
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 pr-10 border border-gray-400 rounded-md w-full sm:w-[400px] md:w-[500px] text-sm leading-6 h-[40px]"
            />
            <div className="absolute right-3 text-gray-500">
              <IoIosSearch />
            </div>
          </div>
        </div>
      </div>

<div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {paginatedData.map((project) => (
    <div
      key={project.ProjectTypeID}
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:scale-105 h-full"
    >
      <div className="p-4 flex-grow flex items-center justify-between">
        {/* Left: Project Name (Editable in Edit Mode) */}
        <div className="flex items-center">
          {editingProjectId === project.ProjectTypeID ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="border rounded-md p-1 text-lg font-semibold text-gray-900"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.ProjectTypeName || "Unnamed Project"}
            </h3>
          )}
        </div>

        {/* Right: Status, Actions (Edit, Delete, Save, Cancel) */}
        <div className="flex items-center space-x-4">
          {editingProjectId === project.ProjectTypeID ? (
            <>
              {/* Status Toggle */}
              <div
                onClick={() =>
                  setEditingStatus((prevStatus) =>
                    prevStatus === "Active" ? "Inactive" : "Active"
                  )
                }
                className={`relative w-14 h-6 rounded-full cursor-pointer transition ${
                  editingStatus === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    editingStatus === "Active" ? "translate-x-8" : "translate-x-0"
                  }`}
                ></div>
              </div>

              {/* Save & Cancel Buttons */}
              <button
                onClick={() => handleSaveProject(project.ProjectTypeID)}
                className="text-green-600"
              >
                Save
              </button>
              <button onClick={handleCancelEdit} className="text-red-600">
                Cancel
              </button>
            </>
          ) : (
            <>
              {/* Status Indicator */}
              <span
                className={`w-3 h-3 rounded-full ${
                  project.Status === "Active" ? "bg-green-600" : "bg-red-600"
                }`}
              ></span>
              <p
                className={`text-sm font-semibold ${
                  project.Status === "Inactive" ? "text-red-600" : "text-green-600"
                }`}
              >
                {project.Status}
              </p>

              {/* Edit & Delete Buttons */}
              <button
                className="p-1.5 sm:p-2 text-[#8B4513] hover:bg-[#8B4513]/10 rounded-lg transition-colors duration-300"
                title="Edit"
                onClick={() => handleEditProject(project)}
              >
                <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                className="p-1.5 sm:p-2 text-[#8B4513] hover:bg-red-50 rounded-lg transition-colors duration-300"
                title="Delete"
                onClick={() => handleDeleteProject(project.ProjectTypeID)}
              >
                <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

      <div className="flex justify-end mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={(page + 1) * rowsPerPage >= projects.length}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectTable;

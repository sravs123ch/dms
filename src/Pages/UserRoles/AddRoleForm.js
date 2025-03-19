import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
// import Popup from "../../components/Popup/Popup";

import Select from "react-select";
import { FETCH_PERMISSION_URL } from "../../Constants/apiRoutes";
import { CREATE_OR_UPDATE_ROLE_URL } from "../../Constants/apiRoutes";
import { DataContext } from "../../Context/DataContext";
import { toast, ToastContainer } from "react-toastify";
const AddRoleForm = () => {
  const [roleName, setRoleName] = useState("");
  const [storeId, setStoreId] = useState("0");
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchPermissions = async () => {
      const token=localStorage.getItem("token");
      try {
        setLoading(true);

        const response = await axios.get(FETCH_PERMISSION_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        const categorizedPermissions = {};

        if (data.Permissions && Array.isArray(data.Permissions)) {
          data.Permissions.forEach((permission) => {
            if (!categorizedPermissions[permission.Module]) {
              categorizedPermissions[permission.Module] = [];
            }
            categorizedPermissions[permission.Module].push(permission);
          });
        }

        setPermissionsByModule(categorizedPermissions);
        console.log(categorizedPermissions);
        console.log(permissionsByModule);
      } catch (err) {
        setError("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);
  


  let roleData = {
    roleId: 0,
    roleName: roleName,
    permissions: [],
  };
  const handleCheckboxChange = (moduleName, permissionId) => {
    setPermissionsByModule((prevState) => {
      const updatedPermissions = { ...prevState };
      updatedPermissions[moduleName] = updatedPermissions[moduleName].map(
        (permission) =>
          permission.ID === permissionId
            ? { ...permission, IsChecked: !permission.IsChecked }
            : permission
      );
      return updatedPermissions;
    });
  };

  const handleSelectAllChange = (moduleName, isChecked) => {
    setPermissionsByModule((prevState) => {
      const updatedPermissions = { ...prevState };
      updatedPermissions[moduleName] = updatedPermissions[moduleName].map(
        (permission) => ({
          ...permission,
          IsChecked: isChecked,
        })
      );
      return updatedPermissions;
    });
  };

  const handleClose = () => {
    navigate("/RoleUser");
  };

  if (error) return <div>{error}</div>;

 
  const handleSaveRole = async (event) => {
    event.preventDefault();
    const token=localStorage.getItem("token");
    let roleData = {
      roleId: 0,
      roleName: roleName,
      permissions: [],
    };

    // Validation
    const validateRoleDataSubmit = () => {
      const newErrors = {};
      if (!roleData.roleName) {
        newErrors.RoleNameError = "Role Name is required.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length > 0; // Return true if there are errors
    };

    const validationError = validateRoleDataSubmit();
    if (validationError) {
      return; // Exit function if validation fails
    }

    Object.keys(permissionsByModule).forEach((module) => {
      permissionsByModule[module].forEach((permission) => {
        roleData.permissions.push({
          permissionId: permission.ID,
          isChecked: permission.IsChecked,
        });
      });
    });

    try {
      setLoading(true);
      const response = await axios.post(CREATE_OR_UPDATE_ROLE_URL, roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle successful role saving here (e.g., navigate or update state)
      setTimeout(() => {
        navigate("/roleuser");
      }, 5500);
    } catch (error) {
      setErrors({ saveError: "Error saving role. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
    // <div className="main-container">
    <div className={`main-container`}>
      <div className=" p-6 rounded-lg ">
        <ToastContainer />
        {loading && <LoadingAnimation />}

        {/* <div className="mt-6 bg-white p-6 rounded-lg shadow-md"> */}
        <h2 className="heading">Add Role</h2>
        <hr className="border-gray-300 my-4 mb-4" />

        <div className="mb-4 flex flex-col items-center justify-center">
          <div className=" flex flex-col sm:flex-row justify-center items-center w-full ">
            <label className="block font-semibold mr-[14px]">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className={`border ${
                errors.RoleNameError && !roleData.roleName
                  ? "border-red-500"
                  : "border-gray-300"
              } p-2 w-full sm:w-1/2 rounded-md`}
              placeholder="Enter Role Name"
            />
          </div>
          <div className="w-full sm:w-1/2 flex justify-center sm:mr-[300px] mt-1 mb-1 ">
            {errors.RoleNameError && !roleData.roleName && (
              <p className="text-red-500 text-sm ">{errors.RoleNameError}</p>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-col items-center justify-center">
          <div className=" flex flex-col sm:flex-row justify-center items-center w-full ">
            <label className="block font-semibold mr-[14px]">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className={`border ${
                errors.RoleNameError && !roleData.roleName
                  ? "border-red-500"
                  : "border-gray-300"
              } p-2 w-full sm:w-1/2 rounded-md`}
              placeholder="Enter Company Name"
            />
          </div>
          <div className="w-full sm:w-1/2 flex justify-center sm:mr-[300px] mt-1 mb-1 ">
            {errors.RoleNameError && !roleData.roleName && (
              <p className="text-red-500 text-sm ">{errors.RoleNameError}</p>
            )}
          </div>
        </div>
        <hr className="border-gray-300 my-4 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(permissionsByModule).map((moduleName) => {
            const isAllSelected = permissionsByModule[moduleName].every(
              (permission) => permission.IsChecked
            );

            return (
              <div
                key={moduleName}
                className="border-[0.5px] border-[#ce8c5d] p-4 rounded-lg bg-white shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#8B4513]">
                    {moduleName}
                  </h2>
                  <label className="text-sm flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) =>
                        handleSelectAllChange(moduleName, e.target.checked)
                      }
                      className="mr-2 form-checkbox h-[12px] w-[12px] text-[#8B4513] border-[#8B4513]"
                    />
                    Select All
                  </label>
                </div>
                <hr className="border-[#8B4513] opacity-20 my-4 mt-2 mb-4" />

                {permissionsByModule[moduleName].map((permission) => (
                  <div key={permission.ID} className="flex items-center mb-2">
                    <label className="flex items-center text-gray-700">
                      <input
                        type="checkbox"
                        checked={permission.IsChecked}
                        onChange={() =>
                          handleCheckboxChange(moduleName, permission.ID)
                        }
                        className="mr-2 form-checkbox h-[12px] w-[12px] text-[#8B4513] border-[#8B4513]"
                      />
                      {permission.Name}
                    </label>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
        
          <button
onClick={handleClose}
  className="flex items-center justify-center px-4 py-2 bg-gradient-to-br from-[#8B4513] to-[#D2691E] text-white rounded-lg hover:from-[#A0522D] hover:to-[#D2691E] transition-all duration-300 w-full sm:w-auto"
>
  
  Close
</button>

<button
  onClick={handleSaveRole}
  className="flex items-center justify-center px-4 py-2 bg-gradient-to-br from-[#8B4513] to-[#D2691E] text-white rounded-lg hover:from-[#A0522D] hover:to-[#D2691E] transition-all duration-300 w-full sm:w-auto"
>
 
  Save Role
</button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleForm;

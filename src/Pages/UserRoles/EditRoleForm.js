import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
import Select from "react-select";
import {
  FETCH_PERMISSION_URL_BY_ROLEID,
  CREATE_OR_UPDATE_ROLE_URL,
} from "../../Constants/apiRoutes";
import { DataContext } from "../../Context/DataContext";
import { toast, ToastContainer } from "react-toastify";

const EditRoleForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roleId, roleName, storeId, storeMap } = location.state || {};
  const [updatedStoreId, setUpdatedStoreId] = useState(storeId);
  const [updatedRoleName, setUpdatedRoleName] = useState(roleName);
  const [permissionsByModule, setPermissionsByModule] = useState({});
  const [loading, setLoading] = useState(true); // Indicates initial loading state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Indicates loading during form submission

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);
  // `${GETORDERBYID_API}/${orderId}`

    // Initialize state based on localStorage value
      const [isExpanded, setIsExpanded] = useState(() => {
       const storedCollapsed = localStorage.getItem('navbar-collapsed');
       return storedCollapsed !== 'true'; // Default to expanded if not set
     });
   
     // Update state when localStorage value changes
     useEffect(() => {
       const handleStorageChange = () => {
         const storedCollapsed = localStorage.getItem('navbar-collapsed');
         setIsExpanded(storedCollapsed !== 'true'); // Set expanded if 'navbar-collapsed' is not 'true'
       };
   
       // Add event listener for storage changes
       window.addEventListener('storage', handleStorageChange);
   
       // Cleanup event listener on component unmount
       return () => {
         window.removeEventListener('storage', handleStorageChange);
       };
     }, []);
   

  // Fetch role permissions and categorize them by PermissionModule
  // useEffect(() => {
  //   const fetchRolePermissions = async () => {
  //     setLoading(true); // Start loading animation when API call starts
  //     try {
  //       const response = await axios.get(
  //         `${FETCH_PERMISSION_URL_BY_ROLEID}/${roleId}?storeId=${storeId}`
  //       );

  //       const data = response.data;
  //       const categorizedPermissions = {};

  //       if (data && Array.isArray(data)) {
  //         data.forEach((permission) => {
  //           const module = permission.PermissionModule; // Use PermissionModule from the response
  //           if (!categorizedPermissions[module]) {
  //             categorizedPermissions[module] = [];
  //           }
  //           categorizedPermissions[module].push({
  //             ID: permission.PermissionId,
  //             Name: permission.PermissionName,
  //             IsChecked: permission.IsChecked,
  //           });
  //         });
  //       }
  //       setPermissionsByModule(categorizedPermissions);
  //     } catch (err) {
  //       setError("Failed to fetch role permissions");
  //     } finally {
  //       setLoading(false); // Stop loading animation when API call is finished
  //     }
  //   };

  //   fetchRolePermissions();
  // }, [roleId, storeId]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);

        const staticPermissions = [
          // Menu Management
          { ID: 90, Module: "Menu Management", Name: "Dashboard", Code: "ACCESS_DASBOARD", IsChecked: false },
          { ID: 101, Module: "Menu Management", Name: "Users", Code: "ACCESS_USERS", IsChecked: false },
          { ID: 102, Module: "Menu Management", Name: "UserRoles", Code: "ACCESS_USERROLES", IsChecked: false },
          { ID: 103, Module: "Menu Management", Name: "View Project Type", Code: "VIEW_PROJECT_TYPE", IsChecked: false },
          { ID: 104, Module: "Menu Management", Name: "View Reference", Code: "ACCESS_REFERENCES", IsChecked: false },
        
          // User Management
          { ID: 201, Module: "User Management", Name: "Add User", Code: "ADD_USER", IsChecked: false },
          { ID: 202, Module: "User Management", Name: "Edit User", Code: "EDIT_USER", IsChecked: false },
          { ID: 203, Module: "User Management", Name: "Delete User", Code: "DELETE_USER", IsChecked: false },
          { ID: 204, Module: "User Management", Name: "View Users", Code: "VIEW_USERS", IsChecked: false },
        
          // Role Management
          { ID: 301, Module: "Role Management", Name: "Add Role", Code: "ADD_ROLE", IsChecked: false },
          { ID: 302, Module: "Role Management", Name: "Edit Role", Code: "EDIT_ROLE", IsChecked: false },
          { ID: 303, Module: "Role Management", Name: "Delete Role", Code: "DELETE_ROLE", IsChecked: false },
          { ID: 304, Module: "Role Management", Name: "View Roles", Code: "VIEW_ROLES", IsChecked: false },
        
          // Project Type Management
          { ID: 401, Module: "Project Type Management", Name: "Add Project Type", Code: "ADD_PROJECT_TYPE", IsChecked: false },
          { ID: 402, Module: "Project Type Management", Name: "Edit Project Type", Code: "EDIT_PROJECT_TYPE", IsChecked: false },
          { ID: 403, Module: "Project Type Management", Name: "Delete Project Type", Code: "DELETE_PROJECT_TYPE", IsChecked: false },
          { ID: 404, Module: "Project Type Management", Name: "View Project Types", Code: "VIEW_PROJECT_TYPES", IsChecked: false },
        
          // Reference Management
          { ID: 501, Module: "Reference Management", Name: "Add Reference", Code: "ADD_REFERENCE", IsChecked: false },
          { ID: 502, Module: "Reference Management", Name: "Edit Reference", Code: "EDIT_REFERENCE", IsChecked: false },
          { ID: 503, Module: "Reference Management", Name: "Delete Reference", Code: "DELETE_REFERENCE", IsChecked: false },
          { ID: 504, Module: "Reference Management", Name: "View References", Code: "VIEW_REFERENCES", IsChecked: false },
        ];
      
        
        // Categorizing permissions by module
        const categorizedPermissions = {};
        staticPermissions.forEach((permission) => {
          if (!categorizedPermissions[permission.Module]) {
            categorizedPermissions[permission.Module] = [];
          }
          categorizedPermissions[permission.Module].push(permission);
        });

        setPermissionsByModule(categorizedPermissions);
      } catch (err) {
        setError("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);
  const handleClose = () => {
    navigate("/RoleUser");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedPermissions = [];

    const payload = {
      roleId,
      roleName: updatedRoleName,
      storeId: updatedStoreId,
      permissions: updatedPermissions,
    };
    const validateRoleDataSubmit = () => {
      if (!payload.roleName) return "Role Name is required.";
      if (!payload.storeId) return "Store ID is required.";
    };
    const validationError = validateRoleDataSubmit();
    if (validationError) {
      toast.error(validationError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Exit function if validation fails
    }

    Object.keys(permissionsByModule).forEach((moduleName) => {
      permissionsByModule[moduleName].forEach((permission) => {
        updatedPermissions.push({
          permissionId: permission.ID,
          isChecked: permission.IsChecked,
        });
      });
    });

    try {
      setIsLoading(true); // Start loading animation during form submission
      const response = await axios.post(
        `${CREATE_OR_UPDATE_ROLE_URL}?storeId=${storeId}`,
        payload
      );

      toast.success("Role updated successfully!");
      setTimeout(() => {
        navigate("/roleuser");
      }, 5500);
    } catch (error) {
      toast.error("Error updating role. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading animation after form submission
    }
  };

  // Show loading animation when page is loading or form is submitting
  if (loading || isLoading) return <LoadingAnimation />;
  if (error) return <div>{error}</div>;

  const storeOptions = stores.map((store) => ({
    value: store.StoreID,
    label: store.StoreName,
  }));
  const handleStoreChange = (selectedOption) => {
    setUpdatedStoreId(selectedOption.value);
  };

  return (
    // <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
    // <div className="main-container">

//      <div
//     className={`main-container ${isExpanded ? 'expanded' : 'collapsed'}`}
//   >
//   <div className="p-6 rounded-lg ">
//     <ToastContainer />
//     <h2 className="text-xl font-semibold mb-6">Edit Role</h2>

//     <hr className="border-gray-300 my-4 mt-6" />

//     {/* Store Name Select */}
//     <div className="mb-4 flex flex-col sm:flex-row justify-center items-center">
//       <label className="block font-semibold mr-2">Store Name</label>
//       <Select
//         value={storeOptions.find(
//           (option) => option.value === updatedStoreId
//         )}
//         onChange={handleStoreChange}
//         options={storeOptions}
//         className="w-full sm:w-1/2"
//       />
//     </div>

//     {/* Role Name Input */}
//     <div className="mb-4 flex flex-col sm:flex-row justify-center items-center">
//       <label className="block font-semibold mr-[14px]">Role Name</label>
//       <input
//         type="text"
//         value={updatedRoleName}
//         onChange={(e) => setUpdatedRoleName(e.target.value)}
//         className="border border-gray-300 p-2 w-full sm:w-1/2 rounded-md"
//       />
//     </div>

//     <hr className="border-gray-300 my-4 mb-6" />

//     {/* Permissions by Module */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {Object.keys(permissionsByModule).map((moduleName) => {
//         const isAllSelected = permissionsByModule[moduleName].every(
//           (permission) => permission.IsChecked
//         );

//         // Restricted permission IDs for Role Management
//         const restrictedPermissions = [7, 8, 9, 48, 31];

//         return (
//           <div
//             key={moduleName}
//             className="border p-4 rounded-lg shadow bg-[#e5efff]"
//           >
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-bold">{moduleName}</h2>
//               <label className="text-sm">
//                 <input
//                   type="checkbox"
//                   checked={isAllSelected}
//                   onChange={(e) =>
//                     handleSelectAllChange(moduleName, e.target.checked)
//                   }
//                   className="mr-2 form-checkbox h-[12px] w-[12px] text-blue-600"
//                   disabled={moduleName === "Role Management"} // Disable "Select All" for Role Management
//                 />
//                 Select All
//               </label>
//             </div>
//             <hr className="border-gray-300 my-4 mt-2 mb-4" />

//             {permissionsByModule[moduleName].map((permission) => (
//               <div key={permission.ID} className="flex items-center mb-2">
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={permission.IsChecked}
//                     onChange={() =>
//                       handleCheckboxChange(moduleName, permission.ID)
//                     }
//                     className="mr-2 form-checkbox h-[12px] w-[12px] text-blue-600"
//                     disabled={
//                       moduleName === "Role Management" &&
//                       restrictedPermissions.includes(permission.ID) // Disable restricted permissions
//                     }
//                   />
//                   {permission.Name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         );
//       })}
//     </div>

//     <div className="mt-10 flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4">
//       <button
//         className="bg-gray-200 px-4 py-2 rounded shadow mb-2 sm:mb-0"
//         onClick={handleClose}
//       >
//         Close
//       </button>
//       <button
//         className="bg-[#003375] text-white px-4 py-2 rounded shadow"
//         onClick={handleSubmit}
//       >
//         Update Role
//       </button>
//       {isLoading && <LoadingAnimation />}
//     </div>
//   </div>
// </div>

<div
  className={`main-container`}
>
  <div className="p-6 rounded-lg ">
    <ToastContainer />
    {/* <h2 className="text-xl font-semibold mb-6"> */}
    <h2 className="text-lg font-bold text-[#8B4513]">
      Edit Role</h2>

    <hr className="border-[#8B4513] opacity-20 my-4 mt-2 mb-4" />

    {/* Role Name Input */}
    <div className="mb-4 flex flex-col sm:flex-row justify-center items-center">
      <label className="block font-semibold mr-[14px]">Role Name</label>
      <input
        type="text"
        value={updatedRoleName}
        onChange={(e) => setUpdatedRoleName(e.target.value)}
        className="border border-gray-300 p-2 w-full sm:w-1/2 rounded-md"
      />
    </div>

    <hr className="border-[#8B4513] opacity-20 my-4 mb-6" />

    {/* Permissions by Module */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.keys(permissionsByModule).map((moduleName) => {
        const isAllSelected = permissionsByModule[moduleName].every(
          (permission) => permission.IsChecked
        );

        // Define restricted permissions for each module
        const restrictedPermissionsByModule = {
          "Role Management": [7, 8, 9, 48, 31],
          "Menu Management": [44],
        };

        const restrictedPermissions =
          restrictedPermissionsByModule[moduleName] || [];

        return (
          <div
            key={moduleName}
          className="border-[0.5px] border-[#ce8c5d] p-4 rounded-lg bg-white shadow-md"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#8B4513]">
                {moduleName}
              </h2>
              <label className="text-sm">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) =>
                    handleSelectAllChange(moduleName, e.target.checked)
                  }
                  // className="mr-2 form-checkbox h-[12px] w-[12px] text-blue-600"
                   className="mr-2 form-checkbox h-[12px] w-[12px] text-[#8B4513] border-[#8B4513]"
                  disabled={restrictedPermissions.length > 0} // Disable "Select All" if restrictions exist
                />
                Select All
              </label>
            </div>
            <hr className="border-gray-300 my-4 mt-2 mb-4" />

            {permissionsByModule[moduleName].map((permission) => (
              <div key={permission.ID} className="flex items-center mb-2">
                <label>
                  <input
                    type="checkbox"
                    checked={permission.IsChecked}
                    onChange={() =>
                      handleCheckboxChange(moduleName, permission.ID)
                    }
                    // className="mr-2 form-checkbox h-[12px] w-[12px] text-blue-600"
                    className="mr-2 form-checkbox h-[12px] w-[12px] text-[#8B4513] border-[#8B4513]"
                    disabled={restrictedPermissions.includes(permission.ID)} // Disable restricted permissions
                  />
                  {permission.Name}
                </label>
              </div>
            ))}
          </div>
        );
      })}
    </div>

    <div className="mt-10 flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4">    
      <button
  onClick={handleClose}
  className="flex items-center justify-center px-4 py-2 bg-gradient-to-br from-[#8B4513] to-[#D2691E] text-white rounded-lg hover:from-[#A0522D] hover:to-[#D2691E] transition-all duration-300 w-full sm:w-auto"
>
  
  Close
</button>

<button
  onClick={handleSubmit}
  className="flex items-center justify-center px-4 py-2 bg-gradient-to-br from-[#8B4513] to-[#D2691E] text-white rounded-lg hover:from-[#A0522D] hover:to-[#D2691E] transition-all duration-300 w-full sm:w-auto"
>
 
Update Role
</button>
      {isLoading && <LoadingAnimation />}
    </div>
  </div>
</div>
  );
};

export default EditRoleForm;

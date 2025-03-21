// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { FiMenu } from "react-icons/fi";
// import {
//   HiOutlineLogout,
//   HiUser,
//   HiHome,
//   HiFolder,
//   HiUserGroup,
//   HiCog,
// } from "react-icons/hi";
// import { Menu } from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { FaUserPlus } from "react-icons/fa";
// import { FaFileAlt } from "react-icons/fa";
// import { useAuth } from "../Context/AuthContext";
// import { PERMISSIONS } from "../Constants/permissions";
// const userNavigation = [
//   { name: "Your profile", href: "/Profile" },
//   { name: "Sign out", href: "/" },
// ];

// const Navigation = ({ isNavbarOpen, toggleNavbar }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [logindata, setLogindata] = useState(null);
//   const { isLoggedIn, permissionsID } = useAuth();
//   // Get user data from localStorage on component mount
//   useEffect(() => {
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       setLogindata(JSON.parse(userData));
//     }
//   }, []);

//   const handleSignOut = () => {
//     localStorage.removeItem("token"); // Clear token
//     localStorage.removeItem("userData"); // Clear user data
//     navigate("/");
//   };

//   useEffect(() => {
//     document.body.classList.toggle("body-pd", isNavbarOpen);
//   }, [isNavbarOpen]);

//   return (
//     <>
//       <header className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 h-12 z-50">
//         <button className="text-xl text-[#632e0f]" onClick={toggleNavbar}>
//           <FiMenu />
//         </button>

//         {/* Profile Menu */}
//         <div className="flex items-center gap-4">
//           <Menu as="div" className="relative">
//             <Menu.Button className="flex items-center gap-2 hover:bg-[#8B4513]/10 rounded-lg px-2 py-1">
//               <img
//                 src={
//                   logindata?.ProfileImage || "https://i.imgur.com/hczKIze.jpg"
//                 }
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full"
//               />
//               <span className="hidden md:block text-sm font-medium text-gray-700">
//                 {logindata
//                   ? `${logindata.FirstName} ${logindata.LastName}`
//                   : "User"}
//               </span>
//               <ChevronDownIcon className="w-5 h-5 text-gray-400" />
//             </Menu.Button>

//             <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//               {userNavigation.map((item) => (
//                 <Menu.Item key={item.name}>
//                   {({ active }) => (
//                     <a
//                       href={item.href}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         if (item.name === "Sign out") {
//                           handleSignOut();
//                         } else {
//                           navigate(item.href);
//                         }
//                       }}
//                       className={`${
//                         active
//                           ? "bg-[#8B4513]/10 text-[#632e0f]"
//                           : "text-gray-700"
//                       } block px-4 py-2 text-sm hover:bg-[#8B4513]/10`}
//                     >
//                       {item.name}
//                     </a>
//                   )}
//                 </Menu.Item>
//               ))}
//             </Menu.Items>
//           </Menu>
//         </div>
//       </header>

//       <div
//         className={`fixed top-0 left-0 h-full transition-all ${
//           isNavbarOpen ? "w-60 md:-z-40" : "w-16"
//         } bg-gradient-to-b from-[#8B4513] via-[#632e0f] to-[#301607]`}
//       >
//         <nav className="flex flex-col h-full mt-14">
//           {/* Main Navigation Links */}
//           <div className="flex flex-col flex-grow">
//             {/* {permissions.includes(PERMISSIONS.ACCESS_DASHBOARD) && ( */}
//             <Link
//               to="/dashboard"
//               className="flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white"
//             >
//               <HiHome className="text-xl" />
//               {isNavbarOpen && (
//                 <span className="text-sm font-medium">Dashboard</span>
//               )}
//             </Link>
//             {/* )} */}

//             {/* {permissions.includes(PERMISSIONS.ACCESS_DASHBOARD) && ( */}
//             <Link
//               to="/documentsList"
//               className="flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white"
//             >
//               <HiFolder className="text-xl" />
//               {isNavbarOpen && (
//                 <span className="text-sm font-medium">Documents</span>
//               )}
//             </Link>
//             {/* )} */}
//             {/* {permissions.includes(PERMISSIONS.ACCESS_USERS) && ( */}
//             <Link
//               to="/users"
//               className={`flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white ${
//                 location.pathname === "/users" && "bg-[#8B4513]/30"
//               }`}
//             >
//               <HiUserGroup className="text-xl" />
//               {isNavbarOpen && (
//                 <span className="text-sm font-medium">Users</span>
//               )}
//             </Link>
//             {/* )} */}
//             {/* {permissions.includes(PERMISSIONS.ACCESS_USERROLES) && ( */}
//             <Link
//               to="/RoleUser"
//               className={`flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white ${
//                 location.pathname === "/RoleUser" && "bg-[#8B4513]/30"
//               }`}
//             >
//               <HiUser className="text-xl" />
//               {isNavbarOpen && (
//                 <span className="text-sm font-medium">User Roles</span>
//               )}
//             </Link>
//             {/* )} */}
//             {/* {permissions.includes(PERMISSIONS.ACCESS_REFERENCES) && ( */}
//             <Link
//               to="/Reference"
//               className={`flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white ${
//                 location.pathname === "/Reference" && "bg-[#8B4513]/30"
//               }`}
//             >
//               <FaUserPlus className="text-xl" />
//               {isNavbarOpen && (
//                 <span className="text-sm font-medium">Reference</span>
//               )}
//             </Link>
//             {/* )} */}
//             {/* {permissions.includes(PERMISSIONS.ACCESS_PROJECTTYPES) && ( */}
//             <Link
//               to="/Project"
//               className={`flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white ${
//                 location.pathname === "/Project" && "bg-[#8B4513]/30"
//               }`}
//             >
//               <FaFileAlt className="text-xl" />
//               {isNavbarOpen && (
//                 <span className="text-sm font-medium">Project Types</span>
//               )}
//             </Link>
//             {/* )} */}
//             {/* Settings Link - Moved higher with margin-top */}
//             <div className="mt-80">
//               <Link
//                 // to="/settings"
//                 className={`flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white ${
//                   location.pathname === "/settings" && "bg-[#8B4513]/30"
//                 }`}
//               >
//                 <HiCog className="text-xl" />
//                 {isNavbarOpen && (
//                   <span className="text-sm font-medium">Settings</span>
//                 )}
//               </Link>

//               {/* Sign Out Button right after settings */}
//               <button
//                 onClick={handleSignOut}
//                 className="w-full flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white text-left"
//               >
//                 <HiOutlineLogout className="text-xl" />
//                 {isNavbarOpen && (
//                   <span className="text-sm font-medium">Sign Out</span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Navigation;


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import {
  HiOutlineLogout,
  HiUser,
  HiHome,
  HiFolder,
  HiUserGroup,
  HiCog,
} from "react-icons/hi";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FaUserPlus, FaFileAlt } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { PERMISSIONS } from "../Constants/permissions";

const userNavigation = [
  { name: "Your profile", href: "/Profile" },
  { name: "Sign out", href: "/" },
];

const Navigation = ({ isNavbarOpen, toggleNavbar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logindata, setLogindata] = useState(null);
  const { isLoggedIn, permissionsID } = useAuth();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setLogindata(JSON.parse(userData));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  useEffect(() => {
    document.body.classList.toggle("body-pd", isNavbarOpen);
  }, [isNavbarOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 h-12 z-50">
        <button className="text-xl text-[#632e0f]" onClick={toggleNavbar}>
          <FiMenu />
        </button>

        <div className="flex items-center gap-4">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 hover:bg-[#8B4513]/10 rounded-lg px-2 py-1">
              <img
                src={logindata?.ProfileImage || "https://i.imgur.com/hczKIze.jpg"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {logindata ? `${logindata.FirstName} ${logindata.LastName}` : "User"}
              </span>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg">
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        item.name === "Sign out" ? handleSignOut() : navigate(item.href);
                      }}
                      className={`${active ? "bg-[#8B4513]/10 text-[#632e0f]" : "text-gray-700"} block px-4 py-2 text-sm`}
                    >
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        </div>
      </header>

      <div className={`fixed top-0 left-0 h-full transition-all ${isNavbarOpen ? "w-60" : "w-16"} bg-gradient-to-b from-[#8B4513] via-[#632e0f] to-[#301607]`}>
        <nav className="flex flex-col h-full mt-14">
          <div className="flex flex-col flex-grow">
            {permissionsID.includes(PERMISSIONS.ACCESS_DASHBOARD) && (
              <Link to="/dashboard" className="flex items-center gap-3 p-3 text-white hover:bg-[#8B4513]/50">
                <HiHome className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">Dashboard</span>}
              </Link>
            )}
            <Link
              to="/documentsList"
              className="flex items-center gap-3 p-3 hover:bg-[#8B4513]/50 text-white"
            >
              <HiFolder className="text-xl" />
              {isNavbarOpen && (
                <span className="text-sm font-medium">Documents</span>
              )}
            </Link>
            {permissionsID.includes(PERMISSIONS.ACCESS_USERS) && (
              <Link to="/users" className="flex items-center gap-3 p-3 text-white hover:bg-[#8B4513]/50">
                <HiUserGroup className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">Users</span>}
              </Link>
            )}
            {permissionsID.includes(PERMISSIONS.ACCESS_USERROLES) && (
              <Link to="/RoleUser" className="flex items-center gap-3 p-3 text-white hover:bg-[#8B4513]/50">
                <HiUser className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">User Roles</span>}
              </Link>
            )}
            {permissionsID.includes(PERMISSIONS.ACCESS_REFERENCES) && (
              <Link to="/Reference" className="flex items-center gap-3 p-3 text-white hover:bg-[#8B4513]/50">
                <FaUserPlus className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">Reference</span>}
              </Link>
            )}
            {permissionsID.includes(PERMISSIONS.ACCESS_PROJECTTYPES) && (
              <Link to="/Project" className="flex items-center gap-3 p-3 text-white hover:bg-[#8B4513]/50">
                <FaFileAlt className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">Project Types</span>}
              </Link>
            )}
            <div className="mt-80">
              <Link to="/settings" className="flex items-center gap-3 p-3 text-white hover:bg-[#8B4513]/50">
                <HiCog className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">Settings</span>}
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 text-white text-left hover:bg-[#8B4513]/50">
                <HiOutlineLogout className="text-xl" />
                {isNavbarOpen && <span className="text-sm font-medium">Sign Out</span>}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;

import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./Navigation/navbar";
import Login from "./Pages/Login/login";
import ForgotPassword from "./Pages/Login/forgotpassword";
import ResetPassword from "./Pages/Login/ResetPassword";
import { LoadingProvider } from "./Context/LoadingContext";
import { UserProvider } from "./Context/userContext";
import DataProvider from "./Context/DataContext";
import { RoleProvider } from "./Context/roleContext";
import { PERMISSIONS } from "./Constants/permissions";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import UserForm from "./Pages/User/Userform";
import Users from "./Pages/User/User";
import RoleUser from "./Pages/UserRoles/UserRole";
import RoleUserAddForm from "./Pages/UserRoles/AddRoleForm";
import RoleUserEditForm from "./Pages/UserRoles/EditRoleForm";
import DocumentsDetails from "./Pages/Documents/DocumentsDetails";
import DocumentsList from "./Pages/Documents/DocumentsList";
import Profile from "./Navigation/Profile";
import Settings from "./Navigation/Settings";
import "./styles/global.css";

const App = () => {
  return (
    <LoadingProvider>
      <UserProvider>
        <DataProvider>
          <RoleProvider>
            <AppWithNavigation />
          </RoleProvider>
        </DataProvider>
      </UserProvider>
    </LoadingProvider>
  );
};

const AppWithNavigation = () => {
  const location = useLocation();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Hide navigation on Login page ("/")
  const showNavigation =
    location.pathname !== "/" &&
    location.pathname !== "/forgot-password" &&
    location.pathname !== "/reset-password";

  return (
    <div className="App flex flex-col min-h-screen">
      {showNavigation && (
        <Navigation
          isNavbarOpen={isNavbarOpen}
          toggleNavbar={() => setIsNavbarOpen(!isNavbarOpen)}
        />
      )}
      <main
        className={`flex-grow bg-gray-100 transition-all duration-300 ${
          showNavigation ? (isNavbarOpen ? "ml-60" : "ml-16") : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
              // allowedRoles={[1, 3]}
              // requiredPermission={PERMISSIONS.VIEW_ORDERS}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userform/:userId"
            element={
              <ProtectedRoute
                // allowedRoles={[1]}
                requiredPermission={
                  PERMISSIONS.ADD_USER ||
                  PERMISSIONS.EDIT_USER ||
                  PERMISSIONS.DELETE_USER
                }
              >
                <UserForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/RoleUser"
            element={
              <ProtectedRoute
                // allowedRoles={[1]}
                requiredPermission={
                  PERMISSIONS.VIEW_USER_ROLES || PERMISSIONS.VIEW_ROLE
                }
              >
                <RoleUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RoleUserAddform"
            element={
              <ProtectedRoute
                // allowedRoles={[1]}
                requiredPermission={PERMISSIONS.ADD_ROLE}
              >
                <RoleUserAddForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RoleUserEditform/:roleId"
            element={
              <ProtectedRoute
                // allowedRoles={[1, 3]}
                requiredPermission={PERMISSIONS.EDIT_ROLE}
              >
                <RoleUserEditForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentsDetails"
            element={
              <ProtectedRoute
                // allowedRoles={[1]}
                requiredPermission={PERMISSIONS.VIEW_FEEDBACKS}
              >
                <DocumentsDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documentsList"
            element={
              <ProtectedRoute
                // allowedRoles={[1]}
                requiredPermission={PERMISSIONS.VIEW_FEEDBACKS}
              >
                <DocumentsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute
              // allowedRoles={[1]}
              // requiredPermission={
              //   PERMISSIONS.VIEW_CUSTOMERS
              // }
              >
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Settings"
            element={
              <ProtectedRoute
              // allowedRoles={[1]}
              // requiredPermission={
              //   PERMISSIONS.VIEW_CUSTOMERS
              // }
              >
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;

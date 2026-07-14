/**
 * PrivateRoute Component
 *
 * Protects application routes by verifying:
 * - The user is authenticated
 * - The user has permission to access the route
 *
 * If the user is not authenticated:
 * - Redirect to the login page.
 *
 * If the user is authenticated but not authorized:
 * - Redirect to the unauthorized page.
 *
 * @param {string[]} allowedRoles List of roles allowed to access the route.
 */
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  // Stores the authenticated user information.
  // (Currently unused and can be removed.)
  //const [user, setUser] = useState({});

  // Indicates whether the user is authenticated.
  const [auth, setAuth] = useState(true);

  // Indicates whether the authenticated user
  // has permission to access the requested route.
  const [allow, setAllow] = useState(true);
  /**
   * Runs once when the component is mounted.
   *
   * Validates:
   * - Authentication token
   * - Logged-in user
   * - User role authorization
   */
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (token === null) {
      setAuth(false);
      setAllow(false);
      // return;
    }
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user != null && user.role !== null) {
        // seUser(user);
        setAuth(true);
        const result = allowedRoles
          .map((e) => e.toLowerCase())
          .includes(user.role.toLowerCase());
        // if (allowedRoles.includes(user.role)) {
        if (result) {
          setAllow(true);
        } else {
          setAllow(false);
        }
      } else {
        setAuth(false);
        setAllow(false);
      }
    }

    return () => {};
  }, []);
  if (!auth) return <Navigate to="/login" />;
  if (!allow) return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default PrivateRoute;

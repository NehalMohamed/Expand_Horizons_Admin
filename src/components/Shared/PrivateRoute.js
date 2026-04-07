// src/components/PrivateRoute.js
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const [user, seUser] = useState({});
  const [Auth, setAuth] = useState(true);
  const [Allow, setAllow] = useState(true);
  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (token == null) {
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
  if (!Auth) return <Navigate to="/login" />;
  if (!Allow) return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default PrivateRoute;

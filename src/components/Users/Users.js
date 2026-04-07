import React, { useEffect } from "react";
import { Container, Table } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, setSearchRole } from "../../slices/usersSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import "./Users.scss";

// Component for Users Management
const Users = () => {
  const dispatch = useDispatch();
  // Get users data and status from Redux store
  const { data, loading, error, searchRole } = useSelector(
    (state) => state.users,
  );
  // State for popup management
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .catch((error) => {
        setPopupMessage(error || "Failed to fetch users");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [dispatch]);

  // Filter users by role if searchRole is specified
  const filteredUsers = searchRole
    ? data &&
      data.filter((user) =>
        (user.roles || "").toLowerCase().includes(searchRole.toLowerCase()),
      )
    : data;

  // Show loading spinner if data is loading
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Container className="users-page">
      {/* PopUp for displaying error messages */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={popupType === "error" ? 5000 : null}
      />

      {/* Header section with title and role search */}
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4 questions-heading">Users Management</h2>
        <div className="mb-4 position-relative" style={{ width: "250px" }}>
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search By Role ..."
            value={searchRole}
            onChange={(e) => dispatch(setSearchRole(e.target.value))}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>

      {/* Users table */}
      <div className="table-responsive">
        <Table responsive hover className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Email Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers &&
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>{user.roles}</td>
                  <td>
                    {user.emailConfirmed ? (
                      <span>Confirmed</span>
                    ) : (
                      <span>Pending</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>

      {/* Show message if no users found */}
      {filteredUsers.length === 0 && !loading && (
        <div className="no-results">
          No users found with the specified role.
        </div>
      )}
    </Container>
  );
};

export default Users;

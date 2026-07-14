import React, { useEffect, useState } from "react";
import { Container, Table, Button, Accordion } from "react-bootstrap";
import { FaSearch, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchRole,
  fetchUsersWithRoles,
  DeleteUser,
  fetchRoles,
} from "../../slices/usersSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import "./Users.scss";
import { FiDelete, FiEdit, FiEye, FiX } from "react-icons/fi";
import AddUserModal from "./AddUserModal";
import UserDetailsModal from "./UserDetailsModal";

function UsersComp() {
  const dispatch = useDispatch();

  // Get users data and UI state from Redux store
  const { UsersList, loading, error, searchRole } = useSelector(
    (state) => state.users,
  );

  // Popup state (used for success/error messages)
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");

  // Modal visibility states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  // Currently selected client id (used in profile modal)
  const [client_id, setclient_id] = useState("");

  // Load users and available roles when the page opens
  useEffect(() => {
    fetchUsersData();
  }, [dispatch]);

  // Fetch all required data for the page
  const fetchUsersData = () => {
    dispatch(fetchRoles());

    dispatch(fetchUsersWithRoles())
      .unwrap()
      .catch((error) => {
        setPopupMessage("Failed to fetch users");
        setPopupType("error");
        setShowPopup(true);
      });
  };

  // Display loading screen while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  // Remove a user from the system
  const RemoveUser = (userId) => {
    dispatch(DeleteUser(userId)).then((result) => {
      if (result.payload && result.payload.isSuccessed) {
        setPopupType("success");

        // Refresh users list after successful deletion
        dispatch(fetchUsersWithRoles());
      } else {
        setPopupType("error");
      }

      setPopupMessage(result.payload?.message);
      setShowPopup(true);
    });
  };

  return (
    <Container className="users-page">
      {/* Success / Error popup */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={popupType === "error" ? 5000 : null}
      />

      {/* Page title */}
      <h2 className="mb-4 questions-heading">Users Management</h2>

      {/* Search box and Add User button */}
      <div className="d-flex justify-content-between align-items-center">
        {/* Search users by role */}
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

        {/* Open Add User modal */}
        <div className="mb-4 position-relative">
          <Button className="purbleBtn" onClick={() => setShowUserModal(true)}>
            <FaPlus className="me-1" /> Add User
          </Button>
        </div>
      </div>

      {/* Users grouped by role */}
      <div className="result_list">
        {UsersList != null && UsersList.length > 0 ? (
          UsersList.filter((item) =>
            item.roles.toLowerCase().includes(searchRole.toLowerCase()),
          ).map((row, index) => (
            <Accordion key={index}>
              <Accordion.Item eventKey={index}>
                {/* Accordion header displays role name and member count */}
                <Accordion.Header>
                  {row.roles} - ({row.count}) members
                </Accordion.Header>

                <Accordion.Body>
                  {row && row.users && row.users.length > 0 ? (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Email Confirmed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {row.users.map((user, key) => (
                          <tr key={key}>
                            {/* User full name */}
                            <td>{`${user.firstName} ${user.lastName}`}</td>

                            {/* User email */}
                            <td>{user.email}</td>

                            {/* Email confirmation status */}
                            <td>
                              {user.emailConfirmed ? (
                                <FaCheck className="text-success" />
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </td>

                            {/* Available actions */}
                            <td>
                              {/* Delete user */}
                              <button
                                className="btn btn-sm btn-info me-2 red-btn grid_btn"
                                disabled={loading}
                                onClick={() => RemoveUser(user.id)}
                              >
                                <FiX />
                              </button>

                              {/* View profile (only available for normal users) */}
                              {row.roles == "User" ? (
                                <button
                                  className="btn btn-sm btn-warning me-2 yellow-btn grid_btn"
                                  disabled={loading}
                                  onClick={() => {
                                    setShowUserDetailsModal(true);
                                    setclient_id(user.id);
                                  }}
                                >
                                  <FiEye />
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    // Display message when a role contains no users
                    <p>No Users</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))
        ) : (
          // Display message when there are no users in the system
          <p>No Users</p>
        )}
      </div>

      {/* Add User Modal */}
      {showUserModal ? (
        <AddUserModal
          show={showUserModal}
          refreshUsers={() => fetchUsersData()}
          onHide={() => {
            setShowUserModal(false);
          }}
        />
      ) : null}

      {/* User Details Modal */}
      {showUserDetailsModal && client_id ? (
        <UserDetailsModal
          client_id={client_id}
          show={showUserDetailsModal}
          onHide={() => {
            setShowUserDetailsModal(false);
          }}
        />
      ) : null}
    </Container>
  );
}

export default UsersComp;

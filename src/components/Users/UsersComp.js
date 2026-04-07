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
  // Get users data and status from Redux store
  const { UsersList, loading, error, searchRole } = useSelector(
    (state) => state.users,
  );
  // State for popup management
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [client_id, setclient_id] = useState("");
  // Fetch users on component mount
  useEffect(() => {
    fetchUsersData();
  }, [dispatch]);

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

  // Show loading spinner if data is loading
  if (loading) {
    return <LoadingPage />;
  }
  const RemoveUser = (userId) => {
    dispatch(DeleteUser(userId)).then((result) => {
      if (result.payload && result.payload.isSuccessed) {
        setPopupType("success");
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
      {/* PopUp for displaying error messages */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={popupType === "error" ? 5000 : null}
      />

      {/* Header section with title and role search */}
      <h2 className="mb-4 questions-heading">Users Management</h2>
      <div className="d-flex justify-content-between align-items-center">
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
        <div className="mb-4 position-relative">
          {" "}
          <Button className="purbleBtn" onClick={() => setShowUserModal(true)}>
            {" "}
            <FaPlus className="me-1" /> Add User
          </Button>
        </div>
      </div>

      <div className="result_list">
        {UsersList != null && UsersList.length > 0 ? (
          UsersList?.filter((item) =>
            item.roles.toLowerCase().includes(searchRole.toLowerCase()),
          ).map((row, index) => (
            <Accordion key={index}>
              <Accordion.Item eventKey={index}>
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
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {row.users.map((user, key) => (
                          <tr key={key}>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.emailConfirmed ? (
                                <FaCheck className="text-success" />
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-info me-2 red-btn grid_btn"
                                disabled={loading}
                                onClick={() => RemoveUser(user.id)}
                              >
                                <FiX />
                              </button>
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
                    <p> No Users</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))
        ) : (
          <p>No Users</p>
        )}
      </div>
      {showUserModal ? (
        <AddUserModal
          show={showUserModal}
          refreshUsers={() => fetchUsersData()}
          onHide={() => {
            setShowUserModal(false);
          }}
        />
      ) : null}
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

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  GetClientProfileByAdmin,
  GetClientProfileImageByAdmin,
} from "../../slices/profileSlice";
import { Modal } from "react-bootstrap";
import LoadingPage from "../Loader/LoadingPage";

function UserDetailsModal({ show, onHide, client_id }) {
  const dispatch = useDispatch();

  // Get user profile data, profile image, and loading state from Redux
  const { profileData, profileImage, loading } = useSelector(
    (state) => state.profile,
  );

  // Load user profile information whenever the selected client changes
  useEffect(() => {
    dispatch(GetClientProfileByAdmin(client_id)).unwrap();
    dispatch(GetClientProfileImageByAdmin(client_id)).unwrap();

    return () => {};
  }, [dispatch, client_id]);

  // Display loading indicator while data is being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      {/* Modal Header */}
      <Modal.Header closeButton>
        <Modal.Title className="page-title">User Profile</Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>
        <div className="user-profile">
          {/* Display profile information if available */}
          {profileData && Object.keys(profileData).length > 0 ? (
            <div className="user-card">
              {/* User profile image (fallback to default image if none exists) */}
              <img
                className="avatar"
                src={
                  profileImage !== null && profileImage.trim() !== ""
                    ? profileImage
                    : "images/no-image.png"
                }
                alt={`${profileData?.client_name}'s avatar`}
              />

              {/* User information */}
              <div className="user-info">
                <h2>{profileData?.client_name}</h2>

                {/* Email */}
                <p>
                  {/* <FiMail className="icon" /> */}
                  <strong>Email:</strong>{" "}
                  {profileData?.client_email || "No data"}
                </p>

                {/* Address */}
                <p>
                  {/* <FaIdCard className="icon" /> */}
                  <strong>Address:</strong> {profileData?.address || "No data"}
                </p>

                {/* Phone Number */}
                <p>
                  {/* <FiPhone className="icon" /> */}
                  <strong>Phone:</strong>{" "}
                  {profileData?.phone_number || "No data"}
                </p>

                {/* Gender */}
                <p>
                  {/* <FiUser className="icon" /> */}
                  <strong>Gender:</strong> {profileData?.gender || "No data"}
                </p>

                {/* Birthday */}
                <p>
                  {/* <FiGift className="icon" /> */}
                  <strong>Birthday:</strong>{" "}
                  {profileData?.client_birthdayStr || "No data"}
                </p>
              </div>
            </div>
          ) : (
            // Show message if the selected user has no profile
            <div className="centerSection">
              <p>No Profile for this user</p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UserDetailsModal;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  GetClientProfileByAdmin,
  GetClientProfileImageByAdmin,
} from "../../slices/profileSlice";
import { Modal } from "react-bootstrap";
import LoadingPage from "../Loader/LoadingPage";
import { FiMail, FiPhone, FiUser, FiGift } from "react-icons/fi";
import { FaIdCard } from "react-icons/fa";
function UserDetailsModal({ show, onHide, client_id }) {
  const dispatch = useDispatch();
  const { profileData, profileImage, loading } = useSelector(
    (state) => state.profile,
  );
  useEffect(() => {
    dispatch(GetClientProfileByAdmin(client_id)).unwrap();
    dispatch(GetClientProfileImageByAdmin(client_id)).unwrap();

    return () => {};
  }, [dispatch, client_id]);
  if (loading) {
    return <LoadingPage />;
  }
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="page-title">User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="user-profile">
          <div className="user-card">
            <img
              className="avatar"
              src={profileImage || "images/no-image.png"}
              alt={`${profileData?.client_name}'s avatar`}
            />
            <div className="user-info">
              <h2>{profileData?.client_name}</h2>
              <p>
                {/* <FiMail className="icon"/> */}
                <strong>Email:</strong> {profileData?.client_email || "No data"}
              </p>
              <p>
                {" "}
                {/* <FaIdCard className="icon"/> */}
                <strong>Address:</strong> {profileData?.address || "No data"}
              </p>
              <p>
                {/* <FiPhone className="icon"/> */}
                <strong>Phone:</strong> {profileData?.phone_number || "No data"}
              </p>
              <p>
                {/* <FiUser className="icon"/> */}
                <strong>gender:</strong> {profileData?.gender || "No data"}
              </p>
              <p>
                {/* <FiGift /> */}
                <strong>BirthDay:</strong>{" "}
                {profileData?.client_birthdayStr || "No data"}
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UserDetailsModal;

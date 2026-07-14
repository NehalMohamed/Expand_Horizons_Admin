import React, { useEffect, useState } from "react";
import TripHeader from "./TripHeader";
import { FaPlus } from "react-icons/fa";
import {
  GetImgsByTrip,
  SaveTripImage,
  UpdateTripImage,
} from "../../slices/tripSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import ImageGallery from "../Shared/ImageGallery/ImageGallery";

/**
 * TripImages Component
 *
 * Purpose:
 * Manages images associated with a trip.
 *
 * Features:
 * - Select a trip using the shared TripHeader component.
 * - Upload one or multiple images for the selected trip.
 * - Automatically rename uploaded files before sending them to the server.
 * - Display uploaded images in a reusable ImageGallery component.
 * - Remove existing images.
 * - Set an image as the default trip image.
 * - Refresh the gallery after every successful operation.
 *
 * Redux Actions:
 * - GetImgsByTrip(): Retrieves all images for the selected trip.
 * - SaveTripImage(): Uploads one or more images.
 * - UpdateTripImage(): Updates image information (default/delete).
 */
function TripImages() {
  const dispatch = useDispatch();

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");

  // Currently selected trip information
  const [trip_id, setTrip_id] = useState(0);
  const [trip_route, setTrip_route] = useState(0);

  // Images displayed in the gallery
  const [images, setImages] = useState([]);

  // Loading state from Redux
  const { loading, error, TripImgs } = useSelector((state) => state.trips);

  /**
   * Generates a unique filename before uploading.
   * Format:
   *    <trip_route>_img_<random>.extension
   */
  const RenameFileFn = (file) => {
    const ext = file.name.split(".").pop();
    const randomId = Math.random().toString(36).substring(2, 10);

    return `${trip_route}_img_${randomId}.${ext}`;
  };

  /**
   * Uploads selected images.
   * - Renames every file.
   * - Sends them to the backend.
   * - Reloads gallery after successful upload.
   */
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    const formData = new FormData();
    formData.append("id", 0);
    formData.append("trip_id", trip_id);
    formData.append("is_default", false);

    files.forEach((file) => {
      const newFileName = RenameFileFn(file);

      console.log("newFileName ", newFileName);

      const renamedFile = new File([file], newFileName, {
        type: file.type,
      });

      formData.append("imgs", renamedFile);
    });

    dispatch(SaveTripImage(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        // Reload images after upload
        dispatch(GetImgsByTrip(trip_id)).then((result) => {
          if (result.payload) {
            setImages(result.payload);
          }
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });

    // Allow selecting the same file again
    e.target.value = "";
  };

  /**
   * Deletes an image from the selected trip.
   */
  const handleRemove = (img) => {
    let data = {
      id: img.id,
      trip_id: img.trip_id,
      img_path: img.img_path,
      img_name: img.img_name,
      is_default: img.is_default,
      delete: true,
    };

    dispatch(UpdateTripImage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        // Refresh gallery
        dispatch(GetImgsByTrip(trip_id)).then((result) => {
          if (result.payload) {
            setImages(result.payload);
          }
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  /**
   * Called when a trip is selected.
   * Loads all images belonging to that trip.
   */
  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    setTrip_route(trip?.route);

    dispatch(GetImgsByTrip(trip?.id)).then((result) => {
      if (result.payload) {
        setImages(result.payload);
      }
    });
  };

  /**
   * Marks an image as the default image for the trip.
   */
  const handleSetDefault = (img) => {
    let data = {
      id: img.id,
      trip_id: img.trip_id,
      img_path: img.img_path,
      img_name: img.img_name,
      is_default: true,
      delete: false,
    };

    dispatch(UpdateTripImage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        // Refresh gallery
        dispatch(GetImgsByTrip(trip_id)).then((result) => {
          if (result.payload) {
            setImages(result.payload);
          }
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  return (
    <section className="layout_section">
      {/* Trip selector */}
      <TripHeader title="Trip Images" handleTripChange={handleTripChange} />

      <hr className="divider" />

      <div className="result_list">
        <div className="gallery-container">
          {/* Upload button (visible only after selecting a trip) */}
          {trip_id && (
            <div className="upload-box">
              <input
                type="file"
                multiple
                accept="image/*"
                id="fileUpload"
                onChange={handleUpload}
                hidden
              />

              <label htmlFor="fileUpload" className="upload-btn">
                <FaPlus /> Upload Images
              </label>
            </div>
          )}

          {/* Shared image gallery */}
          <ImageGallery
            images={images}
            handleRemove={handleRemove}
            handleSetDefault={handleSetDefault}
          />
        </div>
      </div>

      {/* Loading overlay */}
      {loading ? <LoadingPage /> : null}

      {/* Success / Error popup */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={3000}
      />
    </section>
  );
}

export default TripImages;

/**
 * DestinationImages Component
 *
 * Manages destination image galleries.
 *
 * Features:
 * - Select a destination
 * - Display destination images
 * - Upload one or more images
 * - Automatically rename uploaded images
 * - Set a default image
 * - Remove existing images
 */

import React, { useEffect, useState, useCallback } from "react";
import {
  GetImgsByDestination,
  UpdateDestinationImage,
  saveDestinationImage,
} from "../../slices/destinationSlice";
import { Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import ImageGallery from "../Shared/ImageGallery/ImageGallery";
import DestinationDropDown from "./DestinationDropDown";
function DestinationImages() {
  const dispatch = useDispatch();
  // Currently selected destination identifier
  const [destination_id, setDestinationId] = useState(0);

  // Selected destination route used when generating image file names
  const [destination_route, setDestinationRoute] = useState("");

  // Controls popup notification visibility
  const [showPopup, setShowPopup] = useState(false);

  // Popup message content
  const [popupMessage, setPopupMessage] = useState("");

  // Popup notification type (success, error, alert)
  const [popupType, setPopupType] = useState("alert");

  // Images belonging to the selected destination
  const [images, setImages] = useState([]);
  // Loading state while images are retrieved or updated
  const { loading } = useSelector((state) => state.destinations);

  // useEffect(() => {
  //   dispatch(GetDestination_Mains(false));
  //   return () => {};
  // }, [dispatch]);
  /**
   * Loads images for the selected destination.
   *
   * Updates:
   * - Selected destination id
   * - Destination route
   * - Destination image gallery
   *
   * @param {Object} destination Selected destination.
   */
  const handleInputChange = (dest) => {
    // const id = e.target.value;
    setDestinationId(dest?.id);
    setDestinationRoute(dest?.route);
    // Retrieve all images belonging to the selected destination.

    loadDestinationImages(dest?.id);
    // dispatch(GetImgsByDestination(dest?.id)).then((result) => {
    //   if (result.payload) {
    //     setImages(result.payload);
    //   }
    // });
  };
  /**
   * Generates a unique image file name before upload.
   *
   * File format:
   * destinationRoute_img_randomString.extension
   *
   * Example:
   * hurghada_img_ab12cd34.jpg
   *
   * @param {File} file Uploaded image.
   * @returns {string} Generated file name.
   */
  const renameFileFn = (file) => {
    // ✅ Generate custom filename: triproute_img_<random>.ext
    const ext = file.name.split(".").pop();
    const randomId = Math.random().toString(36).substring(2, 10); // random string
    // const safeTripName = rou.replace(/\s+/g, "_").toLowerCase(); // remove spaces
    const newFileName = `${destination_route}_img_${randomId}.${ext}`;
    return newFileName;
  };
  /**
   * Uploads one or more images for the selected destination.
   *
   * Steps:
   * - Read selected files
   * - Generate custom file names
   * - Build FormData request
   * - Upload images
   * - Refresh gallery after successful upload
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleUpload = (e) => {
    // Convert FileList into an array.
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));
    //setImages((prev) => [...prev, ...newImages]);
    const formData = new FormData();
    formData.append("id", 0);
    formData.append("destination_id", destination_id);
    formData.append("is_default", false);
    // files.forEach((img) => {
    //   formData.append("imgs", img); // "Files" matches API param name
    // });
    // Rename each uploaded file before sending it to the server.
    files.forEach((file) => {
      const newFileName = renameFileFn(file);
      console.log("newFileName ", newFileName);
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append("imgs", renamedFile); // "Files" matches API param name
    });
    // Reload the gallery after a successful upload.
    dispatch(saveDestinationImage(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        loadDestinationImages(destination_id);
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
    e.target.value = "";
  };
  /**
   * Removes an image from the selected destination.
   *
   * Performs a soft delete and refreshes
   * the image gallery afterward.
   *
   * @param {Object} image Image to remove.
   */
  const handleRemove = (img) => {
    // Request payload for image deletion.
    let data = {
      id: img.id,
      destination_id: img.destination_id,
      img_path: img.img_path,
      img_name: img.img_name,
      is_default: img.is_default,
      delete: true,
    };
    dispatch(UpdateDestinationImage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        loadDestinationImages(destination_id);
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  /**
   * Marks the selected image as the default image
   * for the current destination.
   *
   * Only one image should be marked as default.
   *
   * @param {Object} image Image to make default.
   */
  const handleSetDefault = (img) => {
    let data = {
      id: img.id,
      destination_id: img.destination_id,
      img_path: img.img_path,
      img_name: img.img_name,
      is_default: true,
      delete: false,
    };
    dispatch(UpdateDestinationImage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        loadDestinationImages(destination_id);
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload.errors);
      }
    });
  };

  /**
   * Reloads all images for the currently selected destination.
   *
   * @param {number} destinationId Destination identifier.
   */
  const loadDestinationImages = useCallback(
    (destinationId) => {
      dispatch(GetImgsByDestination(destinationId)).then((result) => {
        if (result.payload) {
          setImages(result.payload);
        }
      });
    },
    [dispatch],
  );
  return (
    <section className="layout_section">
      {" "}
      <div className="header_title">
        <h2 className="mb-4 page-title">Destination Images</h2>
        <DestinationDropDown handleChange={handleInputChange} />
        {/* <div className="position-relative">
          <Form.Group>
            <Form.Control
              as="select"
              name="destination_id"
              onChange={handleInputChange}
              value={destination_id}
              required
              className="formInput"
            >
              <option value="">select Destination</option>
              {DestinationMain &&
                DestinationMain?.map((dest, index) => (
                  <option key={index} value={dest.id}>
                    {dest.dest_code} - {dest.dest_default_name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        </div> */}
      </div>
      <hr className="divider" />
      <div className="result_list">
        <div className="gallery-container">
          {/* Upload Button */}
          {destination_id && (
            <div className="upload-box">
              <input
                type="file"
                multiple
                accept="image/*"
                id={"fileUpload_" + destination_id}
                onChange={handleUpload}
                //onChange={() => console.log("eeeeeee+" + destination_id)}
                hidden
              />
              <label
                htmlFor={"fileUpload_" + destination_id}
                className="upload-btn"
              >
                <FaPlus /> Upload Images
              </label>
            </div>
          )}
          {/* Gallery Grid */}
          <ImageGallery
            images={images}
            handleRemove={handleRemove}
            handleSetDefault={handleSetDefault}
          />
        </div>
      </div>
      {loading ? <LoadingPage /> : null}
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

export default DestinationImages;

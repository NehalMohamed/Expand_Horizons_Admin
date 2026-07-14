import React, { useState } from "react";
import {
  GetImgsByTransfer,
  UpdateTransferImage,
  SaveTransferImage,
} from "../../slices/transferImageSlice";
import TransferDropDown from "./TransferDropDown";
import { Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import ImageGallery from "../Shared/ImageGallery/ImageGallery";

/**
 * TransferCategoryImages Component
 *
 * Allows administrators to:
 * - Select a transfer category.
 * - View all uploaded images.
 * - Upload new images.
 * - Remove existing images.
 * - Set the default image.
 */
function TransferCategoryImages() {
  const dispatch = useDispatch();

  // Selected transfer category information
  const [category_id, setCategory_id] = useState(0);
  const [category_code, setCategory_code] = useState("");

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");

  // Images belonging to the selected category
  const [images, setImages] = useState([]);

  // Redux state
  const { loading } = useSelector((state) => state.transferImage);

  // (Currently unused) Transfer categories from Redux store
  const TransferCategories = useSelector(
    (state) => state.trips.TransferCategories,
  );

  /**
   * Handles category selection.
   *
   * Updates the selected category and loads
   * all images belonging to that category.
   */
  const handleInputChange = (dest) => {
    const id = dest?.id || 0;

    setCategory_id(id);
    setCategory_code(dest?.category_code || "");

    if (id) {
      dispatch(GetImgsByTransfer(id)).then((result) => {
        if (result.payload) {
          setImages(result.payload);
        }
      });
    } else {
      // Clear gallery when no category is selected
      setImages([]);
    }
  };

  /**
   * Generates a unique filename before upload.
   *
   * Example:
   * AirportTransfer_img_x8f42abc.jpg
   *
   * This avoids duplicate file names on the server.
   */
  const RenameFileFn = (file) => {
    const ext = file.name.split(".").pop();
    const randomId = Math.random().toString(36).substring(2, 10);

    return `${category_code}_img_${randomId}.${ext}`;
  };

  /**
   * Uploads one or more images for the selected category.
   *
   * Steps:
   * 1. Rename files.
   * 2. Create FormData.
   * 3. Upload images.
   * 4. Reload gallery after success.
   */
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    const formData = new FormData();

    formData.append("id", 0);
    formData.append("transfer_category_id", category_id);
    formData.append("is_default", false);

    files.forEach((file) => {
      const newFileName = RenameFileFn(file);

      const renamedFile = new File([file], newFileName, {
        type: file.type,
      });

      formData.append("imgs", renamedFile);
    });

    dispatch(SaveTransferImage(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        // Hide popup if upload succeeded
        setShowPopup(false);

        // Reload latest images
        dispatch(GetImgsByTransfer(category_id)).then((res) => {
          if (res.payload) {
            setImages(res.payload);
          }
        });
      } else {
        // Display upload error
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload?.errors);
      }
    });

    // Allow selecting the same file again
    e.target.value = "";
  };

  /**
   * Removes an image from the selected category.
   *
   * The backend performs a soft delete using
   * the delete flag.
   */
  const handleRemove = (img) => {
    const data = {
      id: img.id,
      transfer_category_id: img.transfer_category_id,
      img_path: img.img_path,
      img_name: img.img_name,
      is_default: img.is_default,
      delete: true,
    };

    dispatch(UpdateTransferImage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        // Refresh gallery
        dispatch(GetImgsByTransfer(category_id)).then((res) => {
          if (res.payload) {
            setImages(res.payload);
          }
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload?.errors);
      }
    });
  };

  /**
   * Marks an image as the default image
   * for the selected transfer category.
   */
  const handleSetDefault = (img) => {
    const data = {
      id: img.id,
      transfer_category_id: img.transfer_category_id,
      img_path: img.img_path,
      img_name: img.img_name,
      is_default: true,
      delete: false,
    };

    dispatch(UpdateTransferImage(data)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);

        // Refresh gallery
        dispatch(GetImgsByTransfer(category_id)).then((res) => {
          if (res.payload) {
            setImages(res.payload);
          }
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload?.errors);
      }
    });
  };

  return (
    <section className="layout_section">
      {/* Page Header */}
      <div className="header_title">
        <h2 className="mb-4 page-title">Transfer Images</h2>

        {/* Transfer Category Selector */}
        <div className="position-relative">
          <Form.Group>
            <TransferDropDown handleChange={handleInputChange} />
          </Form.Group>
        </div>
      </div>

      <hr className="divider" />

      <div className="result_list">
        <div className="gallery-container">
          {/* Upload button appears only after selecting a category */}
          {category_id && (
            <div className="upload-box">
              <input
                type="file"
                multiple
                accept="image/*"
                id={"fileUpload_transfer_" + category_id}
                onChange={handleUpload}
                hidden
              />

              <label
                htmlFor={"fileUpload_transfer_" + category_id}
                className="upload-btn"
              >
                <FaPlus /> Upload Images
              </label>
            </div>
          )}

          {/* Shared image gallery component */}
          <ImageGallery
            images={images}
            handleRemove={handleRemove}
            handleSetDefault={handleSetDefault}
          />
        </div>
      </div>

      {/* Loading indicator during API requests */}
      {loading && <LoadingPage />}

      {/* Popup for success/error messages */}
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

export default TransferCategoryImages;

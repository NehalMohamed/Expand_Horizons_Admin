import React, { useEffect, useState } from "react";
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

function TransferCategoryImages() {
  const [category_id, setCategory_id] = useState(0);
  const [category_code, setCategory_code] = useState("");
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");
  const [images, setImages] = useState([]);
  const { loading } = useSelector((state) => state.transferImage);
  const TransferCategories = useSelector((state) => state.trips.TransferCategories);


  const handleInputChange = (dest) => {
    const id = dest?.id || 0;
    setCategory_id(id);
    setCategory_code(dest?.category_code || "");
    if (id) {
      dispatch(GetImgsByTransfer(id)).then((result) => {
        if (result.payload) setImages(result.payload);
      });
    } else setImages([]);
  };

  const RenameFileFn = (file) => {
    const ext = file.name.split(".").pop();
    const randomId = Math.random().toString(36).substring(2, 10);
    const newFileName = `${category_code}_img_${randomId}.${ext}`;
    return newFileName;
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    formData.append("id", 0);
    formData.append("transfer_category_id", category_id);
    formData.append("is_default", false);
    files.forEach((file) => {
      const newFileName = RenameFileFn(file);
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append("imgs", renamedFile);
    });
    dispatch(SaveTransferImage(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        dispatch(GetImgsByTransfer(category_id)).then((res) => {
          if (res.payload) setImages(res.payload);
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload?.errors);
      }
    });
    e.target.value = "";
  };

  const handleRemove = (img) => {
    let data = {
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
        dispatch(GetImgsByTransfer(category_id)).then((res) => {
          if (res.payload) setImages(res.payload);
        });
      } else {
        setPopupType("error");
        setShowPopup(true);
        setPopupMessage(result.payload?.errors);
      }
    });
  };

  const handleSetDefault = (img) => {
    let data = {
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
        dispatch(GetImgsByTransfer(category_id)).then((res) => {
          if (res.payload) setImages(res.payload);
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
          {" "}
      <div className="header_title">
        <h2 className="mb-4 page-title">Transfer Images</h2>
        <div className="position-relative">
          <Form.Group>
            <TransferDropDown handleChange={handleInputChange} />
          </Form.Group>
        </div>
      </div>
      <hr className="divider" />
      <div className="result_list">
        <div className="gallery-container">
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

export default TransferCategoryImages;

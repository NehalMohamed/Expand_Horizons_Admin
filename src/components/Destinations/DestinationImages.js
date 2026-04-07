import React, { useEffect, useState } from "react";
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
  const [destination_id, setdestination_id] = useState(0);
  const [destination_route, setdestination_route] = useState(0);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [images, setImages] = useState([]);
  const { loading } = useSelector((state) => state.destinations);

  // useEffect(() => {
  //   dispatch(GetDestination_Mains(false));
  //   return () => {};
  // }, [dispatch]);

  const handleInputChange = (dest) => {
    // const id = e.target.value;
    setdestination_id(dest?.id);
    setdestination_route(dest?.route);
    dispatch(GetImgsByDestination(dest?.id)).then((result) => {
      if (result.payload) {
        setImages(result.payload);
      }
    });
  };

  const RenameFileFn = (file) => {
    // ✅ Generate custom filename: triproute_img_<random>.ext
    const ext = file.name.split(".").pop();
    const randomId = Math.random().toString(36).substring(2, 10); // random string
    // const safeTripName = rou.replace(/\s+/g, "_").toLowerCase(); // remove spaces
    const newFileName = `${destination_route}_img_${randomId}.${ext}`;
    return newFileName;
  };
  // Handle file input
  const handleUpload = (e) => {
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
    files.forEach((file) => {
      const newFileName = RenameFileFn(file);
      console.log("newFileName ", newFileName);
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append("imgs", renamedFile); // "Files" matches API param name
    });
    dispatch(saveDestinationImage(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
        dispatch(GetImgsByDestination(destination_id)).then((result) => {
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
    e.target.value = "";
  };
  // Remove image
  const handleRemove = (img) => {
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
        dispatch(GetImgsByDestination(destination_id)).then((result) => {
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

  // Mark image as default
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
        dispatch(GetImgsByDestination(destination_id)).then((result) => {
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

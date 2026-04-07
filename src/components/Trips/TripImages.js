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

function TripImages() {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [popupType, setPopupType] = useState("alert"); // State for popup type
  const [trip_id, setTrip_id] = useState(0);
  const [trip_route, setTrip_route] = useState(0);
  const [images, setImages] = useState([]);
  // const [currentIndex, setCurrentIndex] = useState(null);
  // const [defaultImageId, setDefaultImageId] = useState(null);
  const { loading, error, TripImgs } = useSelector((state) => state.trips);

  const RenameFileFn = (file) => {
    // ✅ Generate custom filename: triproute_img_<random>.ext
    const ext = file.name.split(".").pop();
    const randomId = Math.random().toString(36).substring(2, 10); // random string
    // const safeTripName = rou.replace(/\s+/g, "_").toLowerCase(); // remove spaces
    const newFileName = `${trip_route}_img_${randomId}.${ext}`;
    return newFileName;
  };

  // Handle file input
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }));

    const formData = new FormData();
    formData.append("id", 0);
    formData.append("trip_id", trip_id);
    formData.append("is_default", false);
    files.forEach((file) => {
      const newFileName = RenameFileFn(file);
      console.log("newFileName ", newFileName);
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append("imgs", renamedFile); // "Files" matches API param name
    });
    dispatch(SaveTripImage(formData)).then((result) => {
      if (result.payload && result.payload.success) {
        setShowPopup(false);
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
    e.target.value = "";
  };
  // Remove image
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

  // // Open modal
  // const openModal = (index) => {
  //   setCurrentIndex(index);
  // };

  // // Close modal
  // const closeModal = () => {
  //   setCurrentIndex(null);
  // };

  // // Navigate next/prev
  // const prevImage = () => {
  //   setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  // };
  // const nextImage = () => {
  //   setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  // };

  // // ✅ Keyboard navigation
  // useEffect(() => {
  //   if (currentIndex !== null) {
  //     const handleKeyDown = (e) => {
  //       if (e.key === "Escape") closeModal();
  //       if (e.key === "ArrowLeft") prevImage();
  //       if (e.key === "ArrowRight") nextImage();
  //     };

  //     window.addEventListener("keydown", handleKeyDown);
  //     return () => window.removeEventListener("keydown", handleKeyDown);
  //   }
  // }, [currentIndex, images.length]);

  const handleTripChange = (trip) => {
    setTrip_id(trip?.id);
    setTrip_route(trip?.route);
    // dispatch(GetImgsByTrip(id));
    dispatch(GetImgsByTrip(trip?.id)).then((result) => {
      if (result.payload) {
        setImages(result.payload);
      }
    });
  };

  // Mark image as default
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
      <TripHeader title="Trip Images" handleTripChange={handleTripChange} />
      <hr className="divider" />
      <div className="result_list">
        <div className="gallery-container">
          {/* Upload Button */}
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
          {/* Gallery Grid */}
          <ImageGallery
            images={images}
            handleRemove={handleRemove}
            handleSetDefault={handleSetDefault}
          />
          {/* {images && images.length > 0 ? (
            <div className="gallery-grid">
              {images.map((img, index) => (
                <div className="gallery-item" key={img.id}>
                  <img
                    src={img.img_path}
                    alt={img.img_name}
                    onClick={() => openModal(index)}
                  />
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(img)}
                  >
                    <FaTimes />
                  </button>
                  <button
                    className={`FullWidthBtn  default-btn ${
                      img.is_default ? "active" : ""
                    }`}
                    onClick={() => handleSetDefault(img)}
                  >
                    {img.is_default ? "Default ✓" : "Set Default"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="centerSection">
              <p>No data</p>
            </div>
          )}

          {/* Modal Lightbox */}
          {/* {currentIndex !== null && (
            <div className="lightbox" onClick={closeModal}>
              <button
                className="close-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
              >
                <FaTimes />
              </button>
              <button
                className="nav-btn prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <FaChevronLeft />
              </button>
              <img
                src={images[currentIndex]?.img_path}
                alt={images[currentIndex]?.img_name}
                className="lightbox-img"
              />
              <button
                className="nav-btn next"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <FaChevronRight />
              </button>
            </div>
          )} */}
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

export default TripImages;

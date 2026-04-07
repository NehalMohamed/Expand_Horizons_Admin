import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
function ImageGallery({ images, handleRemove, handleSetDefault }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  // Open modal
  const openModal = (index) => {
    setCurrentIndex(index);
  };

  // Close modal
  const closeModal = () => {
    setCurrentIndex(null);
  };

  // Navigate next/prev
  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // ✅ Keyboard navigation
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
  return (
    <div>
      {/* Gallery Grid */}
      {images && images.length > 0 ? (
        <div className="gallery-grid">
          {images.map((img, index) => (
            <div className="gallery-item" key={img.id}>
              <img
                src={img.img_path}
                alt={img.img_name}
                onClick={() => openModal(index)}
              />
              <button className="remove-btn" onClick={() => handleRemove(img)}>
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
      {currentIndex !== null && (
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
      )}
    </div>
  );
}

export default ImageGallery;

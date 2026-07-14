/**
 * ImageGallery Component
 *
 * Displays a collection of images with support for:
 * - Image preview
 * - Lightbox viewer
 * - Previous / Next navigation
 * - Remove image
 * - Set default image
 *
 * @param {Object[]} images Collection of images to display.
 * @param {Function} handleRemove Removes an image.
 * @param {Function} handleSetDefault Sets an image as the default.
 */
import React, { useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
function ImageGallery({ images, handleRemove, handleSetDefault }) {
  // Index of the currently selected image displayed in the lightbox.
  // A value of null indicates that the lightbox is closed.
  const [currentIndex, setCurrentIndex] = useState(null);
  /**
   * Opens the lightbox and displays
   * the selected image.
   *
   * @param {number} index Index of the selected image.
   */
  const openModal = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  /**
   * Displays the previous image.
   *
   * When the first image is reached,
   * navigation wraps around to the last image.
   */
  // const prevImage = () => {
  //   setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  // };
  const prevImage = useCallback(() => {
    setCurrentIndex((previous) =>
      previous === 0 ? images.length - 1 : previous - 1,
    );
  }, [images.length]);
  /**
   * Displays the next image.
   *
   * When the last image is reached,
   * navigation wraps around to the first image.
   */
  const nextImage = useCallback(() => {
    setCurrentIndex((previous) =>
      previous === images.length - 1 ? 0 : previous + 1,
    );
  }, [images.length]);
  /**
   * Enables keyboard navigation while
   * the lightbox is open.
   *
   * Supported Keys:
   * - Escape: Close lightbox
   * - Left Arrow: Previous image
   * - Right Arrow: Next image
   */
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

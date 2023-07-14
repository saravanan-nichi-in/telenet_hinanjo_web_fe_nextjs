"use client";
import { useRef, useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";
import ProfileAvatar from "../Icons/profileAvatar";
import { SAMPLE_IMAGE } from "../../utils/constant";

export default function Upload(props) {
  const inputRef = useRef(null);
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    if (props.imgSrc && props.imgSrc != null)
      setImageSource((prev) => props.imgSrc);
  }, [props.imgSrc]);

  const handleClick = () => {
    // 👇️ open file input box on click of another element
    inputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileObj = (event?.target?.files && event.target.files[0]) || null;
    if (!fileObj) {
      return;
    }
    setImageSource((prev) => URL.createObjectURL(fileObj));
  };

  return (
    <main>
      <div
        className="avatar"
        style={{ borderRadius: "50%", background: "#D9D9D9" }}
      >
        {imageSource && imageSource != null ? (
          <img
            className="avatar-img-custom"
            src={imageSource}
            alt={SAMPLE_IMAGE}
          />
        ) : (
          <ProfileAvatar />
        )}
        {props.edit && (
          <div className="edit-icon border-4 border-white">
            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <FaPen
              className="custom-icon-edit cursor-pointer"
              onClick={handleClick}
            />
          </div>
        )}
      </div>
    </main>
  );
}

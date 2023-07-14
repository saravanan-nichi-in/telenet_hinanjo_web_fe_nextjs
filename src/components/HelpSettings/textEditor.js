"use client";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
const ReactQuill =
  typeof window === "object" ? require("react-quill") : () => false;
const EditorComponent = ({ onChange }) => {
  const [value, setValue] = useState("");
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ header: [1, 2, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["image", "video", "link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background", // Add color formats
    "code-block",
    "script",
    "align",
  ];

  const handleValueChange = (content) => {
    setValue(content);
    // Call the onChange callback function passed from the parent
    onChange(content);
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleValueChange}
      />
    </div>
  );
};

export default EditorComponent;

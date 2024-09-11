"use client";

import { useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";

const Editor = ({ startCode, onCodeChange }) => {
  const handleCodeChange = (value) => {
    onCodeChange(value);
  };

  return (
    <CodeMirror
      value={startCode}
      height="40vh"
      onChange={handleCodeChange}
      theme="dark"
      style={{ fontSize: "12pt", backgroundColor: "transparent" }}
    />
  );
};

export default Editor;

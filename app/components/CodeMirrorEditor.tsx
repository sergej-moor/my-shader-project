// components/CodeMirrorEditor.js
"use client";

import { useEffect, useRef } from "react";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

const CodeMirrorEditor = ({ startCode, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const baseTheme = EditorView.theme(
      {
        "&": {
          fontSize: "20pt",
          color: "white",
          backgroundColor: "transparent",
          height: "80vh",
        },
        ".cm-editor, .cm-editor:focused": {
          outline: "0 !important",
        },
        ".cm-content": {
          caretColor: "#0e9",
        },
        ".cm-scroller": {
          overflow: "scroll",
          border: "none",
        },
        "&.cm-focused": {
          outline: 0,
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "#0e9",
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
          backgroundColor: "#074",
        },
        ".cm-gutters": {
          backgroundColor: "transparent",
          color: "#ddd",
          border: "none",
          outline: "none",
        },
      },
      { dark: true }
    );

    const codeUpdateListener = EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        const code = v.state.doc.toString();
        onCodeChange(code);
      }
    });

    const state = EditorState.create({
      doc: startCode,
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        javascript(),
        baseTheme,
        codeUpdateListener,
      ],
    });

    const editorView = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      editorView.destroy();
    };
  }, [startCode, onCodeChange]);

  return <div ref={editorRef} />;
};

export default CodeMirrorEditor;

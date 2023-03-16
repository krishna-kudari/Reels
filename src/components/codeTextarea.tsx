import React, { useState, useEffect } from "react";

interface CodeTextareaProps {
  code: string;
  updateCode: (code: string) => void;
}

const CodeTextarea: React.FC<CodeTextareaProps> = ({ code, updateCode }) => {
  
  const [text, setCode] = useState("");
  useEffect(()=>{
    updateCode(text);
  },[text])
  // useEffect(() => {
  //   const keywords = ["if", "else", "while", "for", "function"];
  //   const comments = /\/\/.*$/gm;
  //   const strings = /(['"])(\\?.)*?\1/g;

  //   function highlightCode() {
  //     let highlightedCode = "" + code;

  //     // Replace special characters with HTML entities
  //     highlightedCode = highlightedCode
  //       .replace(/&/g, "&amp;")
  //       .replace(/</g, "&lt;")
  //       .replace(/>/g, "&gt;");

  //     // Highlight keywords
  //     keywords.forEach((keyword) => {
  //       const re = new RegExp("\\b" + keyword + "\\b", "g");
  //       highlightedCode = highlightedCode.replace(
  //         re,
  //         '<span class="text-blue-500 font-bold">' + keyword + "</span>"
  //       );
  //     });

  //     // Highlight comments
  //     highlightedCode = highlightedCode.replace(
  //       comments,
  //       '<span class="text-green-500 italic">$&</span>'
  //     );

  //     // Highlight strings
  //     highlightedCode = highlightedCode.replace(
  //       strings,
  //       '<span class="text-red-500">$&</span>'
  //     );

  //     return highlightedCode;
  //   }

  //   const highlightedCode = highlightCode();

  //   // Set the innerHTML of the textarea to the highlighted code
  //   const codeTextArea = document.getElementById("code-textarea");
  //   codeTextArea.innerHTML = highlightedCode;

  //   // Add an event listener to update the highlighted code when the user types in the textarea
  //   codeTextArea.addEventListener("input", () => {
  //     const highlightedCode = highlightCode();
  //     codeTextArea.innerHTML = highlightedCode;
  //   });
  // }, [code]);

  return (
    <textarea
      id="code-textarea"
      className="w-full outline-none h-56 p-4 bg-systembgDark-100 text-white font-mono text-lg rounded-md resize-none overflow-y-auto overflow-x-auto"
      value={code}
      title="code"
      aria-label="code"
      placeholder="code ? code : '' "
      onChange={e => setCode(e.target.value)}
    ></textarea>
  );
};

export default CodeTextarea;

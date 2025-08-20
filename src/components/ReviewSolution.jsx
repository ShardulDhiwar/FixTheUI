import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";

function IframePreview({ html = "", css = "", height = 300 }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!doctype html>
      <html>
        <head>
          <style>
            html,body{margin:0;padding:0}
            *,*:before,*:after{box-sizing:border-box}
          </style>
          <style>${css || ""}</style>
        </head>
        <body>
          ${html || ""}
        </body>
      </html>
    `);
    doc.close();
  }, [html, css]);

  return (
    <iframe
      ref={iframeRef}
      title="preview"
      style={{ width: "100%", height, border: 0 }}
    />
  );
}

export default function ReviewSolution() {
  const { id } = useParams();
  const challengeId = id;
  const [solution, setSolution] = useState({ html: "", css: "" });

  // 🔥 Theme state with persistence
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const userSolutions =
      JSON.parse(localStorage.getItem("userSolutions")) || {};
    if (userSolutions[challengeId]) {
      setSolution(userSolutions[challengeId]);
    }
  }, [challengeId]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    renderWhitespace: "all",
    renderIndentGuides: true,
    guides: {
      indentation: true,
      highlightActiveIndentation: true,
    },
    folding: true,
    scrollBeyondLastLine: false,
    wordWrap: "on",
    automaticLayout: true,
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
      } flex flex-col`}
    >
      {/* Top Bar */}
      <div
        className={`flex items-center justify-between px-6 py-4 border-b shadow-sm ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <Link
          to="/challenges"
          className={`font-medium ${
            isDark
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-500"
          }`}
        >
          ← Back to Challenges
        </Link>
        <h1 className="text-xl font-bold">Review Solution</h1>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`px-3 py-1 rounded text-sm transition ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
        >
          {isDark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side - Monaco Editors */}
        <div className="w-1/2 p-4 overflow-y-auto flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">HTML</h2>
            <Editor
              height="250px"
              defaultLanguage="html"
              value={solution.html}
              theme={isDark ? "vs-dark" : "light"}
              options={editorOptions}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">CSS</h2>
            <Editor
              height="250px"
              defaultLanguage="css"
              value={solution.css}
              theme={isDark ? "vs-dark" : "light"}
              options={editorOptions}
            />
          </div>
        </div>

        {/* Right Side - Preview */}
        <div
          className={`w-1/2 p-4 border-l overflow-y-auto ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
          <div
            className={`border rounded shadow-inner ${
              isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
            }`}
          >
            <IframePreview html={solution.html} css={solution.css} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
}

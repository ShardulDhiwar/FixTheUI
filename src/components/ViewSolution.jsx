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

export default function ViewSolution() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch("/challenges.json");
        if (!res.ok) throw new Error("Failed to fetch challenges");

        const data = await res.json();
        const found = data.find((c) => String(c.id) === String(id));

        if (found) {
          setChallenge(found);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on",
    scrollBeyondLastLine: false,
    wordWrap: "on",
    automaticLayout: true,
  };

  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading solution...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Challenge not found</p>
          <Link
            to={`/playground/${id}`}
            className="text-blue-500 hover:underline"
          >
            ← Back to Playground
          </Link>
        </div>
      </div>
    );
  }

  const goalCss = challenge.goalCss || challenge.css?.goal || "";
  const goalHtml = challenge.goalHtml || challenge.html || "";

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
          to={`/playground/${id}`}
          className={`font-medium ${
            isDark
              ? "text-blue-400 hover:text-blue-300"
              : "text-blue-600 hover:text-blue-500"
          }`}
        >
          ← Back to Playground
        </Link>
        <h1 className="text-xl font-bold">Solution: {challenge.title}</h1>

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
            <h2 className="text-lg font-semibold mb-2">HTML Solution</h2>
            <Editor
              height="250px"
              defaultLanguage="html"
              value={goalHtml}
              theme={isDark ? "vs-dark" : "light"}
              options={editorOptions}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">CSS Solution</h2>
            <Editor
              height="250px"
              defaultLanguage="css"
              value={goalCss}
              theme={isDark ? "vs-dark" : "light"}
              options={editorOptions}
            />
          </div>

          {/* Challenge Info */}
          <div
            className={`p-4 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-semibold mb-2">Challenge Details</h3>
            <p className="text-sm mb-2">
              <span className="font-medium">Difficulty:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  challenge.difficulty === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : challenge.difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {challenge.difficulty}
              </span>
            </p>
            <p className="text-sm">{challenge.description}</p>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div
          className={`w-1/2 p-4 border-l overflow-y-auto ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-300"
          }`}
        >
          <h2 className="text-lg font-semibold mb-2">Live Preview</h2>
          <div
            className={`border rounded shadow-inner ${
              isDark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <IframePreview html={goalHtml} css={goalCss} height={500} />
          </div>
        </div>
      </div>
    </div>
  );
}

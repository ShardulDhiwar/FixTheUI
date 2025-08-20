import { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

function IframePreview({ html = "", css = "", height = 260 }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html,body{margin:0;padding:0}
      *,*:before,*:after{box-sizing:border-box}
    </style>
    <style>${css || ""}</style>
  </head>
  <body>
    ${html || ""}
  </body>
</html>`);
    doc.close();
  }, [html, css]);

  return (
    <iframe
      ref={iframeRef}
      title="preview"
      style={{ width: "100%", height, border: 0, background: "transparent" }}
    />
  );
}

export default function Playground() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState("html");
  const [userHTML, setUserHTML] = useState("");
  const [userCSS, setUserCSS] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 🔥 Theme state (dark by default, but persistent)
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // simple toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const normalizeCss = (css) =>
    (css || "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .replace(/;}/g, "}")
      .trim();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const res = await fetch("/challenges.json");
        if (!res.ok) throw new Error("Failed to fetch challenges");

        const data = await res.json();
        const found = data.find((c) => String(c.id) === String(id));

        if (found) {
          setChallenge(found);
          setUserHTML(
            found.goalHtml || found.html || "<!-- Write your HTML here -->"
          );
          const starter =
            found.goalCssStarter ||
            found.css?.starter ||
            found.starterCode ||
            "/* Write your CSS here */";
          setUserCSS(starter);
        } else {
          setError("Challenge not found");
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleSubmit = () => {
    const goalCss = challenge?.goalCss || challenge?.css?.goal || "";
    const isMatch = normalizeCss(userCSS) === normalizeCss(goalCss);

    if (isMatch) {
      showToast("✅ Correct! Your CSS matches the goal.", "success");

      const completedChallenges =
        JSON.parse(localStorage.getItem("completedChallenges")) || [];

      const userSolutions =
        JSON.parse(localStorage.getItem("userSolutions")) || {};

      if (!completedChallenges.includes(challenge.id)) {
        completedChallenges.push(challenge.id);
        localStorage.setItem(
          "completedChallenges",
          JSON.stringify(completedChallenges)
        );
      }

      userSolutions[challenge.id] = { html: userHTML, css: userCSS };
      localStorage.setItem("userSolutions", JSON.stringify(userSolutions));

      setTimeout(() => {
        navigate("/challenges");
      }, 1200);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading challenge...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-400 mb-4">{error}</p>
          <Link to="/challenges" className="text-blue-500 hover:underline">
            ← Back to Challenges
          </Link>
        </div>
      </div>
    );

  if (!challenge)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Challenge not found</p>
          <Link to="/challenges" className="text-blue-500 hover:underline">
            ← Back to Challenges
          </Link>
        </div>
      </div>
    );

  const goalCss = challenge.goalCss || challenge.css?.goal || "";

  // 🎨 Light/Dark theme styles
  const isDark = theme === "dark";
  const bgClass = isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900";
  const panelClass = isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300";
  const editorTheme = isDark ? "vs-dark" : "vs-light";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Header */}
      <div className={`${panelClass} border-b px-6 py-4 flex items-center justify-between`}>
        <div>
          <Link
            to="/challenges"
            className={`text-sm mb-2 inline-block ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
          >
            ← Back to Challenges
          </Link>
          <h1 className="text-2xl font-bold">{challenge.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded border text-sm hover:opacity-80 transition"
          >
            {isDark ? "🌙 Dark" : "☀️ Light"}
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Submit Solution
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Monaco Editor */}
        <div className={`w-1/2 ${panelClass} flex flex-col`}>
          {/* Tabs */}
          <div className={`flex border-b ${isDark ? "border-gray-700" : "border-gray-300"}`}>
            <button
              onClick={() => setActiveTab("html")}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "html"
                  ? `${isDark ? "bg-gray-900 text-blue-400" : "bg-white text-blue-600 border-b-2 border-blue-400"}`
                  : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"}`
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab("css")}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === "css"
                  ? `${isDark ? "bg-gray-900 text-blue-400" : "bg-white text-blue-600 border-b-2 border-blue-400"}`
                  : `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"}`
              }`}
            >
              CSS
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            {activeTab === "html" ? (
              <Editor
                height="100%"
                defaultLanguage="html"
                value={userHTML}
                theme={editorTheme}
                onChange={(val) => setUserHTML(val || "")}
                options={{ minimap: { enabled: false } }}
              />
            ) : (
              <Editor
                height="100%"
                defaultLanguage="css"
                value={userCSS}
                theme={editorTheme}
                onChange={(val) => setUserCSS(val || "")}
                options={{ minimap: { enabled: false } }}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Goal + Your Output */}
        <div className={`w-1/2 p-4 overflow-y-auto flex flex-col gap-6 ${bgClass}`}>
          <div>
            <h3 className="font-semibold mb-2">🎯 Desired Goal</h3>
            <div className={`border p-4 rounded shadow-inner ${panelClass}`}>
              <IframePreview html={challenge.goalHtml} css={goalCss} height={280} />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">🧑‍💻 Your Output</h3>
            <div className={`border p-4 rounded shadow-inner ${panelClass}`}>
              <IframePreview html={userHTML} css={userCSS} height={280} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

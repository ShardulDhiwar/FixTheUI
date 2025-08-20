import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // Sync theme with localStorage + document
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch("/challenges.json");
        const data = await res.json();
        console.log("✅ Fetched challenges:", data);

        const completedChallenges =
          JSON.parse(localStorage.getItem("completedChallenges")) || [];

        const completedIds = completedChallenges.map(String);

        const updatedChallenges = Array.isArray(data)
          ? data.map((c) => ({
              ...c,
              completed: completedIds.includes(String(c.id)),
            }))
          : [];

        setChallenges(updatedChallenges);
      } catch (err) {
        console.error("❌ Error fetching challenges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-50"
      }`}
    >
      {/* Top Navbar */}
      <nav
        className={`border-b px-6 py-4 transition-colors ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              FixTheUI
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/challenges"
                className={`font-medium ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600"
                }`}
              >
                Challenges
              </Link>
              <Link
                to="/about"
                className={`font-medium ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                About
              </Link>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            CSS Challenges
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Practice your CSS skills with these interactive challenges
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading challenges...</p>
        ) : challenges.length === 0 ? (
          <p className="text-red-500">No challenges found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                to={
                  challenge.completed
                    ? `/review/${challenge.id}`
                    : `/playground/${challenge.id}`
                }
                className={`block rounded-lg border shadow-sm transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 hover:shadow-md"
                    : "bg-white border-gray-200 hover:shadow-md"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : challenge.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    {challenge.completed && (
                      <span className="text-green-500 text-sm font-medium">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <h2
                    className={`text-xl font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {challenge.title}
                  </h2>
                  <p
                    className={`text-sm mb-4 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {challenge.description}
                  </p>
                  <div
                    className={`w-full text-center py-2 px-4 rounded-md font-medium text-white transition-colors ${
                      challenge.completed
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {challenge.completed ? "Review Solution" : "Start Challenge"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function About() {
  // 🔥 Theme state with persistence
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Top Navbar */}
      <nav
        className={`px-6 py-4 border-b ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-2xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              FixTheUI
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/challenges"
                className={`font-medium ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Challenges
              </Link>
              <Link
                to="/about"
                className={`font-medium ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                About
              </Link>
            </div>
          </div>

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
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">About FixTheUI</h1>
        </div>
        <div className="space-y-6">
          {/* What is FixTheUI? */}
          <div
            className={`rounded-lg shadow-sm border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="text-2xl font-semibold mb-2">
                What is FixTheUI?
              </div>
            </div>
            <div className="p-6 leading-relaxed">
              <p className="mb-4">
                FixTheUI is an interactive CSS practice platform designed to
                help developers improve their styling skills through hands-on
                challenges. Each challenge presents a visual goal and asks you
                to write the CSS code needed to achieve that result.
              </p>
              <p>
                Whether you're a beginner learning the basics of CSS or an
                experienced developer looking to sharpen your skills, FixTheUI
                provides a structured way to practice and learn.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div
            className={`rounded-lg shadow-sm border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="text-2xl font-semibold mb-2">How It Works</div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step}
                    </div>
                    <div>
                      {step === 1 && (
                        <>
                          <h3 className="font-semibold mb-1">
                            Choose a Challenge
                          </h3>
                          <p className="text-gray-400">
                            Browse through challenges organized by difficulty
                            level
                          </p>
                        </>
                      )}
                      {step === 2 && (
                        <>
                          <h3 className="font-semibold mb-1">Write Your CSS</h3>
                          <p className="text-gray-400">
                            Use the built-in code editor to write your solution
                          </p>
                        </>
                      )}
                      {step === 3 && (
                        <>
                          <h3 className="font-semibold mb-1">
                            See Results Instantly
                          </h3>
                          <p className="text-gray-400">
                            Compare your output with the goal to see how you're
                            doing
                          </p>
                        </>
                      )}
                      {step === 4 && (
                        <>
                          <h3 className="font-semibold mb-1">
                            Learn and Improve
                          </h3>
                          <p className="text-gray-400">
                            Get feedback and hints to help you master CSS
                            concepts
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div
            className={`rounded-lg shadow-sm border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="text-2xl font-semibold mb-2">Features</div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">✨ Interactive Challenges</h3>
                  <p className="text-sm text-gray-400">
                    Real-time preview of your CSS changes
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">📚 Progressive Difficulty</h3>
                  <p className="text-sm text-gray-400">
                    From beginner to advanced levels
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">💡 Instant Feedback</h3>
                  <p className="text-sm text-gray-400">
                    See your results immediately
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">🎯 Focused Learning</h3>
                  <p className="text-sm text-gray-400">
                    Each challenge targets specific CSS concepts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div
            className={`rounded-lg shadow-sm border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="text-2xl font-semibold mb-2">Get Started</div>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Ready to improve your CSS skills? Head over to the challenges
                page and start with a beginner-level challenge. Each challenge
                is designed to teach you something new while reinforcing what
                you already know.
              </p>
              <Link
                to="/challenges"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Practicing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

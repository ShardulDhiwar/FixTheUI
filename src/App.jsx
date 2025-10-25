import { Routes, Route } from "react-router-dom";
import Home from "./components/Home"; // landing
import Challenges from "./components/Challenges";
import About from "./components/About";
import Playground from "./components/Playground";
import ReviewSolution from "./components/ReviewSolution";
import ViewSolution from "./components/ViewSolution";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/playground/:id" element={<Playground />} />
      <Route path="/review/:id" element={<ReviewSolution />} />
      <Route path="/solution/:id" element={<ViewSolution />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

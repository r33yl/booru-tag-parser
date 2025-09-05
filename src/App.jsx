import { HashRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import { colors } from "./config/colors";
import AnimatedBackground from "./pages/AnimatedBackground";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <HashRouter>
      <div className={`flex flex-col min-h-screen relative z-10 ${colors.bg} ${colors.text}`}>
        <AnimatedBackground />

        <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </div>

        <footer
          className={`mt-auto text-center ${colors.secondaryText} py-4 px-12 ${colors.footerMotion}`}
        >
          <a
            href="https://github.com/r33yl/booru-tag-parser"
            className={`${colors.footerLink}`}
          >
            Source on GitHub
          </a>{" | "}
          <Link to="/terms" className={`${colors.footerLink}`}>
            Terms of Use
          </Link>{" | "}
          <Link to="/privacy" className={`${colors.footerLink}`}>
            Privacy Policy
          </Link>
        </footer>

        <button
          className="fixed bottom-1 left-1 w-14 h-14"
          style={{ background: "url(./logo512.png)", backgroundSize: "contain" }}
          onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=43s", "_blank")}
        />
      </div>

      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </HashRouter>
  );
}

export default App;

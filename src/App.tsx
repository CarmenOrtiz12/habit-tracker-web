import { useEffect, useState } from "react";

import AppRouter from "./routes/AppRouter";

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") ?? "light";
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  }

  return <AppRouter theme={theme} toggleTheme={toggleTheme} />;
}

export default App;
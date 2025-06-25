import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

function DarkModeSwitcher() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference only after the component mounts
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []); // Empty dependency array means this runs only once after initial mount

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="dark-light-mode d-flex justify-content-center cursor-pointer">
      <Form.Check
        reverse
        type="switch"
        id="mode-switch"
        label={
          <>
            <i
              className={`${
                darkMode ? "ri-sun-line text-xl" : "ri-moon-line text-xl"
              }`}
            ></i>
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </>
        }
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
    </div>
  );
}

export default DarkModeSwitcher;

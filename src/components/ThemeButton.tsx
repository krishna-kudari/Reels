import React, { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
const ThemeButton = () => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const handleClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };
  useEffect(() => {
    const systemDefaultTheme = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    
    if (theme != "light") document.documentElement.classList.add(theme);
  }, []);
  
  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="w-8 h-8 rounded-full "
      style={{
        background: "linear-gradient(90deg , #eee 0 50% , #222 50% 100%)",
      }}
    ></div>
  );
};

export default ThemeButton;


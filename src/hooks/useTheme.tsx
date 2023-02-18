import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
const useTheme = () => {
    const [theme, setTheme] = useLocalStorage("theme", () => {
        return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      });
    
      const handleClick = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark");
      };
      useEffect(() => {
        if (theme != "light") document.documentElement.classList.add(theme);
      }, []);
      return [theme , setTheme];
}

export default useTheme;
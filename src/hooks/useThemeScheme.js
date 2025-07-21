// hooks/useThemeScheme.js
import { useEffect, useState } from "react";

export default function useThemeScheme() {
  const [scheme, setScheme] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.getAttribute("data-theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const attr = root.getAttribute("data-theme");
      if (attr === "dark" || attr === "light") setScheme(attr);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return scheme;
}

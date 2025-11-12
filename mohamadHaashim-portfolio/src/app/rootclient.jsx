"use client";

import "./globals.css";
import Navbar from "../app/components/navebar";
import "../app/styles/globals.css";
import { useEffect, useState } from "react";

export default function RootLayoutClient({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body className="bg-gray-900 text-white">
        <Navbar />
        <main className="pt-20 max-w-6xl mx-auto px-4 mt-10">{children}</main>
      </body>
    </html>
  );
}

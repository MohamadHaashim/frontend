"use client";
import { useEffect, useState } from "react";
import DarkToggle from "../../app/components/ThemeToggle";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "portfolio", "skills", "resume", "contact"];
      let current = "home";

      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "portfolio", label: "Portfolio" },
    { id: "skills", label: "Skills" },
    { id: "resume", label: "Resume" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[100%] max-w-6xl bg-white shadow-lg rounded-full z-50 border border-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-8 py-3">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#fba85a] to-[#f87295] bg-clip-text text-transparent">Haashim</h1>
        <div className="space-x-6 flex items-center">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
             className={`relative group transition-colors duration-300 ${
              activeSection === item.id
                ? "bg-gradient-to-r from-[#fba85a] to-[#f87295] bg-clip-text text-transparent"
                : "text-gray-700"
            }`}
            >
              {item.label}
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-[#fba85a] to-[#f87295] transition-all duration-300 ${
                  activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </a>
          ))}

          {/* <DarkToggle /> */}
        </div>
      </div>
    </nav>
  );
}

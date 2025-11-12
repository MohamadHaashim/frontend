"use client";
import { motion } from "framer-motion";
import SmoothScroll from "../app/components/smoothscrolling";

import HomeSection from "../app/home/page";
import AboutSection from "../app/about/page";
import PortfolioSection from "../app/portfolio/page";
import SkillsSection from "../app/skills/page";
import ResumeSection from "../app/resume/page";
import ContactSection from "../app/contact/page";
import { useState, useEffect } from "react";

export default function Page() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedHours = hours.toString().padStart(2, "0");

      setTime(`${formattedHours}:${minutes} ${ampm}`);
    };

    updateTime(); // set initially
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <>
      {/* Smooth Scrolling */}
      <SmoothScroll />

      <div className="space-y-32">
        <section id="home">
          <HomeSection />
        </section>

        {/* Full tablet-style About Section */}
        <motion.section
          id="about"
          className="flex justify-center my-12"
          initial={{ opacity: 0, scale: 0.9, y: -80 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.4 }}
        >
          {/* Tablet Frame */}
          <div className="relative w-full max-w-[900px] flex justify-center p-6">
            {/* Bezel */}
            <div className="bg-black rounded-3xl p-4 shadow-2xl relative w-900">

              {/* Top Status Bar */}
              <div className="flex justify-between items-center bg-black bg-opacity-30 text-white text-xs px-4 py-1 rounded-t-3xl">
                {/* Left: Notifications */}
                <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-70 px-3 py-1 rounded-full">
                  <span className="whitespace-nowrap">🔔 You have 3 new notifications</span>
                  <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full">3</span>
                </div>

                {/* Center: Time */}
                <div className="flex items-end text-sm w-full justify-end space-x-3">
                  <span>{time}</span>
                </div>

                {/* Right: Signal & Battery */}
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <span>📶</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🔋</span>
                    <span>78%</span>
                  </span>
                </div>
              </div>

              {/* Small Top Dot */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full shadow-inner"></div>

              {/* Content Area */}
              <div className="bg-white rounded-b-2xl p-8 md:p-16 w-[90vw] max-w-[860px] h-[500px] overflow-y-auto">
                <AboutSection />
              </div>

              {/* Bottom Navigation Bar */}
              <div className="flex justify-between items-center bg-black bg-opacity-100 rounded-b-2xl p-2">
                <div className="relative">
                  <button className="text-white px-4 py-1 hover:bg-gray-700 rounded">🏠︎</button>
                  {/* Notification Badge */}
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    3
                  </span>
                </div>

                <div className="relative">
                  <button className="text-white px-4 py-1 hover:bg-gray-700 rounded">↩</button>
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    !
                  </span>
                </div>

                <button className="text-white px-4 py-1 hover:bg-gray-700 rounded">↻</button>
              </div>
            </div>
          </div>
        </motion.section>




        {/* Portfolio Section */}
        <motion.section
          id="portfolio"
          initial={{ opacity: 0, y:-30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <PortfolioSection />
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <SkillsSection />
        </motion.section>

        {/* Resume Section */}
        <motion.section
          id="resume"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <ResumeSection />
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <ContactSection />
        </motion.section>
      </div>
    </>
  );
}

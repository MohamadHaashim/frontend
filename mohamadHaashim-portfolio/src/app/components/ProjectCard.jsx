"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
export default function ProjectCard({
  title,
  desc,
  link,
  index,
  isBlurred,
  onHoverStart,
  onHoverEnd,
  date,
  shortdes,
  Location,
  image,
  logo,
  technologies,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPopup = () => setIsOpen(true);
  const handleClosePopup = () => setIsOpen(false);

  return (
    <>
      <motion.div
        className={`p-6 bg-white rounded-xl shadow-md transition duration-300 ${
          isBlurred ? "blur-sm opacity-60" : "blur-0 opacity-100"
        }`}
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.3 }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      >
      <div className="flex justify-between items-start">
        <div className="flex-wrap">
        <h3 className="text-xl font-bold">{title}</h3>
        <h3 className="text-s font-light">{technologies}</h3>
        </div>
        <Image src={logo} alt={title} className="w-16 h-16 object-cover rounded" />
        </div>
        <p className="text-gray-600">{shortdes}</p>
        <button
          onClick={handleOpenPopup}
          className="text-indigo-600 mt-3 inline-block font-medium hover:underline"
        >
          View Project →
        </button>
      </motion.div>

      {/* Popup (Modal) */}
      {isOpen && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center"
          >
            <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">{date}</p>
              <p className="text-sm text-gray-600">{Location}</p>
            </div>
            </div>
            <p className="text-gray-700 mb-6">{desc}</p>
           {image && <img src={image} alt={title} className="mb-4 rounded"/>}
            {/* {link && (
              <a
                href={link}
                target="_blank"
                className="text-indigo-600 font-medium hover:underline"
              >
                Open Project in New Tab ↗
              </a>
            )} */}
            <div className="mt-6">
              <button
                onClick={handleClosePopup}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

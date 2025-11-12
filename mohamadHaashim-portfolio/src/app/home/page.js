"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import profilePic from "../../../public/softwarepic.png";

export default function HomeSection() {
  return (
    <motion.div
      className="h-screen flex flex-col justify-center items-center text-center bg-platinum-gradient"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-6xl mx-auto p-4">
  <div className="flex flex-row md:flex-row items-center">
    
    {/* Left Column - Text */}
    <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left md:pr-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
        Hi, I’m <span className="text-indigo-600">Haashim 👋</span>
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Frontend Developer | React | Tailwind | React Native
      </p>
    </div>

    {/* Right Column - Image */}
    <div className="w-full flex justify-center md:justify-end items-end mt-6 md:ml-100">
      <Image
        src={profilePic}
        alt="Haashim Profile"
        // width={250}
        // height={250}
        // className="rounded-full border-4 border-indigo-600"
      />
    </div>

  </div>
      </div>
    </motion.div>
  );
}

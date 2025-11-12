"use client";

import { motion } from "framer-motion";
import SectionTitle from "../../app/components/SectionTitle";

export default function AboutSection() {
  return (
    <section className="space-y-4">
      <SectionTitle title="About Me" />

      <motion.p
        className="text-black-300 leading-relaxed"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
      >
        I'm <b>Mohamad Haashim</b>, a passionate frontend developer with
        experience in <b>React.js, React Native, and Tailwind CSS</b>.  
        I love building modern web and mobile applications with clean design and
        smooth user experience.
      </motion.p>
    </section>
  );
}

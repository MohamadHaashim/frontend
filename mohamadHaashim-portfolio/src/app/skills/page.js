"use client";
import { motion } from "framer-motion";
import SectionTitle from "../../app/components/SectionTitle";

export default function Skills() {
  const skills = [
    { name: "React.js", level: 90, color: "#61DBFB" }, 
    { name: "React Native", level: 85, color: "#8e44ad" },
    { name: "Tailwind CSS", level: 95, color: "#38BDF8" }, 
    { name: "JavaScript", level: 80, color: "#F7DF1E" }, 
  ];

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="py-12">
      <SectionTitle title="Skills" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
        {skills.map((s, i) => (
          <motion.div
            key={i}
            className="relative p-6 bg-white rounded-xl shadow-md flex flex-col items-center overflow-hidden group cursor-pointer transition-all duration-500"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            {/* Expanding corner background */}
            <span
              className="absolute top-0 left-0 w-12 h-12 rounded-br-full transform scale-100 group-hover:scale-[400] transition-transform duration-2000 ease-in-out"
              style={{ backgroundColor: s.color }}
            ></span>

            {/* Circle Progress */}
            <div className="relative w-24 h-24 mt-4 z-10">
              <svg className="w-24 h-24 -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r={radius}
                  stroke={s.color}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{
                    strokeDashoffset: circumference * (1 - s.level / 100),
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  viewport={{ once: false }}
                />
              </svg>
              <motion.span
                className="absolute inset-0 flex items-center justify-center font-bold text-indigo-600 group-hover:text-black transition-colors duration-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2 }}
                viewport={{ once: false }}
              >
                {s.level}%
              </motion.span>
            </div>

            {/* Skill Name */}
            <p
              className="mt-3 font-medium text-gray-800 group-hover:text-white transition-colors duration-500 z-10"
            >
              {s.name}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

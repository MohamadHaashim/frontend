import SectionTitle from "../../app/components/SectionTitle";
import { useState } from "react";

export default function Resume() {
  const studies = [
    {
      title: "Hermon solution",
      school: "Chennai",
      year: "2024-Present",
      desc: "Completed my Master’s with focus on Computer Science and Frontend development.",
    },
    {
      title: "Bright UI Technologies",
      school: "Coimbatore",
      year: "2023-2024",
      desc: "Completed my Master’s with focus on Computer Science and Frontend development.",
    },
    {
      title: "Master’s Degree",
      school: "Annai College",
      year: "2023",
      desc: "Completed my Master’s with focus on Computer Science and Frontend development.",
    },
    {
      title: "Bachelor’s Degree",
      school: "Annai College",
      year: "2021",
      desc: "Studied core programming, web technologies, and software engineering.",
    },
    {
      title: "Higher Secondary",
      school: "Govt School, Mayiladuthurai",
      year: "2017",
      desc: "Specialized in Computer Science and Mathematics.",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-12">
      <SectionTitle title="Resume" />

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {studies.map((s, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md text-center overflow-hidden cursor-pointer transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-indigo-500">{s.title}</h3>

            {hoveredIndex === i && (
              <div className="mt-4 transition-all duration-300">
                <p className="text-black font-medium">{s.school}</p>
                <span className="block text-sm text-gray-600">{s.year}</span>
                <p className="mt-2 text-sm text-gray-700">{s.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

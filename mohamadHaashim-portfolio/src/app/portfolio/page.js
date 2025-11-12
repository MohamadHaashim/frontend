"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import SectionTitle from "../../app/components/SectionTitle";
import ProjectCard from "../../app/components/ProjectCard";
import { image } from "framer-motion/client";
import klassridelogo from "../../../public/klassridelogo.png";
import edisonawardslogo from "../../../public/Edisonawaredslogo.webp";
import provetlogo from "../../../public/provetlogo.png";
import Adsautomationlogo from "../../../public/ADSAUTOMATION.png";
import E_commerce from "../../../public/e-commercelogo.png"
import adminportallogo from "../../../public/ADMINPORTALlogo.png"

export default function Portfolio() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const projects = [
    { 
      logo:klassridelogo,
      title: "Klass Ride", 
      shortdes: "Ride-sharing mobile app",
      technologies: "Mobile Application",
      desc: "Developed a full-featured mobile application using React Native from scratch for both passengers and drivers. Implemented user authentication using Firebase Authentication. Integrated Google Maps API for real-time location tracking and route navigation. Enabled secure payment processing through payment gateway integration. Focused on delivering a smooth and responsive user experience across both Android and iOS platforms.", 
      difficulty:"",
      link: "#" ,
      date: "10/2024 - present",
      Location:"Chennai,Tamilnadu",
      image:"",
    },
    { 
      logo:edisonawardslogo,
      title: "Edison Awards", 
      shortdes: "React Native mobile app for public voting",
      technologies: "Mobile Application",
      desc: "Developed a React Native mobile application for the Edison Awards to facilitate public voting.Implemented features allowing organizations to create nominees under specific award categories.Enabled users to vote for their preferred nominees with a simple and intuitive interface.", 
      difficulty:"",
      link: "#",
      date: "01/2025 - 04/2025",
      Location:"Chennai,Tamilnadu",
      image:"",
    },
    { 
      logo:provetlogo,
      title: "Provet Pharma", 
      shortdes: "Pharmaceutical mobile app",
      technologies: "Mobile Application",
      desc: "Developed a React Native mobile application for Provet Pharma, designed for use by medical representatives.Built functionality to calculate accurate animal dosages based on species, weight, and medical conditions.Integrated a dynamic product binding feature to display and link veterinary products within the app.Focused on delivering a user-friendly interface tailored for field representatives in the veterinary industry.", 
      difficulty:"",
      link: "#" ,
      date: "01/2025- 03/2025",
      Location:"Chennai,Tamilnadu",
      image:"",
    },
    { 
      logo:Adsautomationlogo,
      title: "ADS Automation", 
      shortdes: "set budget rules for ad campaigns",
      technologies: "Web Application",
      desc: "Designed and developed the Budget Rule Optimizer module using React.js to automate ad campaign budgeting for customers.Implemented functionality to create and manage budget rules tailored to customer requirements.Developed features to automatically generate and maintain ad campaigns based on the defined rules.Integrated meeting scheduling functionality to help organize and manage client interactions efficiently.Focused on delivering a dynamic, interactive frontend experience for smooth campaign and rule management.", 
      difficulty:"",
      link: "#" ,
      date: "12/2024- 01/2025",
      Location:"Chennai,Tamilnadu",
      image:"",
    },
    { 
      logo:E_commerce,
      title: "E-Commerce", 
      shortdes: "Mobile phone sales web application",
      technologies: "Web Application",
      desc: "Developed a web-based e-commerce application focused on mobile phone sales using React.js.Built three key modules to handle customer data listing, mobile inventory management, and product display.Implemented filtering and sorting features to enhance product browsing and user experience.Enabled efficient customer detail management and real-time updates to mobile stock information.Focused on creating a responsive, user-friendly interface with dynamic data handling.", 
      difficulty:"",
      link: "#" ,
      date: "08/2024- 09/2024",
      Location:"Coimbatore, Tamilnadu",
      image:"",
    },
    { 
      logo:adminportallogo,
      title: "Admin Portal", 
      shortdes: "Job application management",
      technologies: "Web Application",
      desc: "Developed an admin portal using React.js to manage job applications and company vacancies.Implemented functionality to capture and store resumes submitted by visitors through the company website.Enabled real-time syncing of posted job vacancies, ensuring they are displayed automatically on the company site.Designed admin features to create, update, and manage job postings efficiently.Focused on streamlining the recruitment process and improving communication between applicants and HR.", 
      difficulty:"",
      link: "#" ,
      date: "05/2024- 07/2024",
      Location:"Coimbatore, Tamilnadu",
      image:"",
    },
  ];

  return (
    <section className="py-12 space-y-8">
      <SectionTitle title="Portfolio" />

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={{
          visible: { transition: { staggerChildren: 0.3 } }
        }}
      >
        {projects.map((p, i) => (
          <ProjectCard
            key={i}
            {...p}
            index={i}
            isBlurred={hoveredIndex !== null && hoveredIndex !== i}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
          />
        ))}
      </motion.div>
    </section>
  );
}

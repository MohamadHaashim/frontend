
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import BlockQuotes from "../../../assets/images/clarityblockquoteline.svg";

import ClientImage1 from "../../../assets/images/ellipse-18@2x.png";
import ClientImage2 from "../../../assets/images/ellipse-16@2x.png";
import ClientImage3 from "../../../assets/images/ellipse-17@2x.png";

interface Testimonial {
    fullname: string;
    companyname: string;
    designation: string;
    TestimonialsText: string;
    ClientImage: { url: string }[];
}

const ClientSays: React.FC = () => {
    const [testimonials, setTestimonials] = useState<any[]>([]); // Initialize with empty array
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
                const data = await response.json();
                const landingPageData = data.find((page: { name: string; }) => page.name === "Landing Page");
                if (landingPageData) {
                    if (landingPageData.fields) {
                        const testimonialsData = landingPageData.fields.find((field: { title: string; }) => field.title === "Testimonials");
                        if (testimonialsData && testimonialsData.components) {
                            const employeeInformation = testimonialsData.components
                                .find((component: { key: string; }) => component.key === "testimonials")?.defaultValue?.employeeInformation;
                            if (employeeInformation && Array.isArray(employeeInformation)) {
                                setTestimonials(employeeInformation);
                            } else {
                                console.error("Error: No employeeInformation found.");
                            }
                        } else {
                            console.error("Error: Testimonials data is missing or malformed.");
                        }
                    } else {
                        console.error("Error: 'fields' property is missing in Landing Page data.");
                    }
                } else {
                    console.error("Error: 'Landing Page' data is missing.");
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Auto-scroll function
    useEffect(() => {
        const itemsPerView = 3; // You can change this to match your design
        const totalItems = testimonials.length;

        const autoScroll = () => {
            setCurrentIndex((prevIndex) => {
                let nextIndex = prevIndex + 1;
                if (nextIndex >= totalItems) {
                    nextIndex = 0; // Reset to the first item
                }
                return nextIndex;
            });
        };

        const interval = setInterval(autoScroll, 5000); // Set interval for auto scroll every 5 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [testimonials]);

    if (loading) {
        return <div>Loading testimonials...</div>; // Show loading state
    }

    return (
        <div className="row client-says-container">
            <div
                className="row"
                style={{
                    transform: `translateX(-${(100 / testimonials.length) * currentIndex}%)`,
                    transition: "transform 0.5s ease-in-out",
                }}
            >
                {testimonials.map((item, index) => (
                    <div key={index} className="col-md-4">
                        <div className="client-says-card">
                            <div className="client-photo">
                                {item.ClientImage.map((image: { url: string }, imageIndex: React.Key) => (
                                    <img className="basic-clientImg" key={imageIndex} src={image.url || ClientImage1} alt={item.fullname} />
                                ))}
                            </div>
                            <div className="client-says-header">
                                <h2>{item.fullname}</h2>
                                <p>
                                    {item.designation} - {item.companyname}
                                </p>
                            </div>
                            <div className="client-says-quote">
                                <img className="blockqoutes" src={BlockQuotes} alt="quote" />
                            </div>
                            <div className="client-says-content">
                                <p dangerouslySetInnerHTML={{ __html: item.TestimonialsText }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientSays;

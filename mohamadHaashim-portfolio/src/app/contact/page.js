import SectionTitle from "../../app/components/SectionTitle";

export default function Contact() {
  return (
    <section className="py-12 mb-40">
      <SectionTitle title="Contact Me" />
      <form className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-3 rounded-md"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-3 rounded-md"
        />
        <textarea
          placeholder="Your Message"
          className="w-full border p-3 rounded-md"
          rows="5"
        />
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-md">
          Send Message
        </button>
      </form>
    </section>
  );
}

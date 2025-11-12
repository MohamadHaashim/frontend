export default function SectionTitle({ title }) {
  return (
    <h2 className="text-3xl font-bold text-black mb-6 inline-block relative pb-2">
      {title}
      <span className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-[#fba85a] to-[#f87295] rounded-full"></span>
    </h2>
  );
}

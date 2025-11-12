export default function DarkToggle({ theme, setTheme }) {
  return (
    <button
      className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}

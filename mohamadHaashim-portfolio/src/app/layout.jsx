import "./globals.css";
import Navbar from "../app/components/navebar";
import "../app/styles/globals.css";
export const metadata = {
  title: "Haashim Portfolio",
  description: "Personal portfolio of Mohamad Haashim",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-20 max-w-7xl mx-auto px-2">{children}</main>
      </body>
    </html>
  );
}

// Main layout — includes Navbar and Footer
import AppNavbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FAFAF9" }}>
      <AppNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}